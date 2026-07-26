import { json } from '@sveltejs/kit';
import { FLUTTERWAVE_SECRET_KEY } from '$env/static/private';
import { formatCurrency, defaultCurrency, NGN_PER_USD } from '$lib/utils/currency';

export async function POST({ request, locals }) {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	// Derived from the stored profile, never from the request body — the client
	// must not be able to pick which currency it is billed in.
	const currency = defaultCurrency(locals.profile?.country);

	// ₦100 is fine to charge in Naira, but converts to $0.06 — below any card
	// processor's floor. USD deposits start at the equivalent of $1.
	const minDepositNgn = currency === 'NGN' ? 100 : NGN_PER_USD;

	// `amount` is always the NGN value to credit — wallet balances are NGN.
	const { amount } = await request.json();
	const amountNgn = Math.round(Number(amount));
	if (!amountNgn || amountNgn < minDepositNgn) {
		return json(
			{ error: `Minimum deposit is ${formatCurrency(minDepositNgn, locals.profile?.country)}` },
			{ status: 400 }
		);
	}

	const chargeAmount =
		currency === 'NGN' ? amountNgn : Math.round((amountNgn / NGN_PER_USD) * 100) / 100;

	if (chargeAmount <= 0) return json({ error: 'Deposit amount is too small' }, { status: 400 });

	const tx_ref = `FLW-${locals.user.id}-${Date.now()}`;

	const { error: txError } = await locals.supabase.from('transactions').insert({
		user_id: locals.user.id,
		amount: amountNgn, // credited to the wallet on success
		type: 'deposit',
		reference: tx_ref,
		status: 'pending',
		charge_amount: chargeAmount, // what the gateway actually collects
		charge_currency: currency
	});

	if (txError) return json({ error: txError.message }, { status: 500 });

	return json({ tx_ref, amount: chargeAmount, currency, amountNgn });
}
