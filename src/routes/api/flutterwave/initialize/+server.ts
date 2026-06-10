import { json } from '@sveltejs/kit';
import { FLUTTERWAVE_SECRET_KEY } from '$env/static/private';

export async function POST({ request, locals }) {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { amount } = await request.json();
	const parsed = parseInt(amount);
	if (!parsed || parsed < 100) return json({ error: 'Minimum deposit is ₦100' }, { status: 400 });

	const tx_ref = `FLW-${locals.user.id}-${Date.now()}`;

	const { error: txError } = await locals.supabase.from('transactions').insert({
		user_id: locals.user.id,
		amount: parsed,
		type: 'deposit',
		reference: tx_ref,
		status: 'pending'
	});

	if (txError) return json({ error: txError.message }, { status: 500 });

	return json({ tx_ref, amount: parsed });
}
