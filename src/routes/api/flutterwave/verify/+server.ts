import { json } from '@sveltejs/kit';
import { FLUTTERWAVE_SECRET_KEY } from '$env/static/private';
import { BONUS_FIRST_DEPOSIT_PERCENT, BONUS_FIRST_DEPOSIT_MINIMUM } from '$lib/utils/constants';

export async function POST({ request, locals }) {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { tx_ref, transaction_id } = await request.json();
	if (!tx_ref || !transaction_id) return json({ error: 'Missing tx_ref or transaction_id' }, { status: 400 });

	const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
		headers: { Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}` }
	});
	const verifyData = await verifyRes.json();

	if (verifyData.status !== 'success' || verifyData.data.status !== 'successful') {
		return json({ error: 'Payment verification failed' }, { status: 400 });
	}

	if (verifyData.data.tx_ref !== tx_ref) {
		return json({ error: 'Transaction reference mismatch' }, { status: 400 });
	}

	const amount = verifyData.data.amount;

	const { data: existingTx } = await locals.supabase
		.from('transactions')
		.select('status')
		.eq('reference', tx_ref)
		.single();

	if (!existingTx || existingTx.status !== 'pending') {
		return json({ error: 'Transaction already processed or not found' }, { status: 400 });
	}

	let bonusAmount = 0;
	if (amount >= BONUS_FIRST_DEPOSIT_MINIMUM) {
		const { count } = await locals.supabase
			.from('transactions')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', locals.user.id)
			.eq('type', 'deposit')
			.eq('status', 'completed');
		if (count === 0) {
			bonusAmount = Math.floor(amount * BONUS_FIRST_DEPOSIT_PERCENT / 100);
		}
	}

	const { data: wallet } = await locals.supabase
		.from('wallets')
		.select('*')
		.eq('user_id', locals.user.id)
		.single();

	const { error: updateError } = await locals.supabase
		.from('wallets')
		.update({
			balance: (wallet?.balance || 0) + amount,
			bonus_balance: (wallet?.bonus_balance || 0) + bonusAmount
		})
		.eq('user_id', locals.user.id);

	if (updateError) return json({ error: updateError.message }, { status: 500 });

	const { error: txUpdateError } = await locals.supabase
		.from('transactions')
		.update({ status: 'completed' })
		.eq('reference', tx_ref);

	if (txUpdateError) return json({ error: txUpdateError.message }, { status: 500 });

	if (bonusAmount > 0) {
		await locals.supabase.from('transactions').insert({
			user_id: locals.user.id,
			amount: bonusAmount,
			type: 'bonus',
			reference: `BONUS-${tx_ref}`,
			status: 'completed'
		});
	}

	return json({ success: true, amount, bonusAmount });
}
