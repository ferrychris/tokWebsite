export async function load({ locals }: { locals: App.Locals }) {
	const { data: wallets } = await locals.supabase.from('wallets').select('*');
	const { data: transactions } = await locals.supabase
		.from('transactions')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(50);

	return { wallets: wallets || [], transactions: transactions || [] };
}
