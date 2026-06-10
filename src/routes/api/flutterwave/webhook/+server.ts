import { json } from '@sveltejs/kit';
import { FLUTTERWAVE_SECRET_KEY, FLUTTERWAVE_WEBHOOK_HASH } from '$env/static/private';
import { BONUS_FIRST_DEPOSIT_PERCENT, BONUS_FIRST_DEPOSIT_MINIMUM } from '$lib/utils/constants';

export async function POST({ request, locals }) {
	const signature = request.headers.get('verif-hash');
	if (!signature || signature !== FLUTTERWAVE_WEBHOOK_HASH) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: any;
	try {
		body = await request.json();
	} catch (e) {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	// Only process charge.completed events with successful status
	if (body.event !== 'charge.completed' || body.data?.status !== 'successful') {
		return json({ success: true, message: 'Event ignored' });
	}

	const tx_ref = body.data.tx_ref;
	const transaction_id = body.data.id;

	if (!tx_ref || !transaction_id) {
		return json({ error: 'Missing tx_ref or transaction_id' }, { status: 400 });
	}

	// Verify the transaction directly with Flutterwave API (defense-in-depth)
	const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
		headers: { Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}` }
	});
	const verifyData = await verifyRes.json();

	if (verifyData.status !== 'success' || verifyData.data?.status !== 'successful') {
		return json({ error: 'Payment verification failed' }, { status: 400 });
	}

	if (verifyData.data.tx_ref !== tx_ref) {
		return json({ error: 'Transaction reference mismatch' }, { status: 400 });
	}

	const amount = verifyData.data.amount;

	// Query the transaction in Supabase
	const { data: existingTx, error: selectError } = await locals.supabase
		.from('transactions')
		.select('status, user_id')
		.eq('reference', tx_ref)
		.maybeSingle();

	if (selectError) {
		return json({ error: selectError.message }, { status: 500 });
	}

	if (!existingTx) {
		return json({ error: 'Transaction not found' }, { status: 400 });
	}

	// Idempotency: if already processed, return 200 OK
	if (existingTx.status !== 'pending') {
		return json({ success: true, message: 'Transaction already processed' });
	}

	// Calculate first-deposit bonus if applicable
	let bonusAmount = 0;
	if (amount >= BONUS_FIRST_DEPOSIT_MINIMUM) {
		const { count, error: countError } = await locals.supabase
			.from('transactions')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', existingTx.user_id)
			.eq('type', 'deposit')
			.eq('status', 'completed');

		if (!countError && count === 0) {
			bonusAmount = Math.floor(amount * BONUS_FIRST_DEPOSIT_PERCENT / 100);
		}
	}

	// Invoke the SECURITY DEFINER Postgres function to securely update tables bypassing RLS
	const { data: rpcResult, error: rpcError } = await locals.supabase.rpc('process_flutterwave_deposit', {
		p_tx_ref: tx_ref,
		p_amount: amount,
		p_bonus_amount: bonusAmount,
		p_secret_hash: FLUTTERWAVE_WEBHOOK_HASH
	});

	if (rpcError) {
		return json({ error: rpcError.message }, { status: 500 });
	}

	if (!rpcResult?.success) {
		return json({ error: rpcResult?.error || 'Database update failed' }, { status: 400 });
	}

	return json({ success: true, amount, bonusAmount });
}
