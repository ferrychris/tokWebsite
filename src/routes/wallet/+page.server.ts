export async function load({ locals }: { locals: App.Locals }) {
	if (!locals.user) return { wallet: null, transactions: [] };

	let [walletRes, txRes] = await Promise.all([
		locals.supabase.from('wallets').select('*').eq('user_id', locals.user.id).maybeSingle(),
		locals.supabase.from('transactions').select('*').eq('user_id', locals.user.id).order('created_at', { ascending: false }).limit(20)
	]);

	let wallet = walletRes.data;
	if (!wallet) {
		const { data: newWallet } = await locals.supabase
			.from('wallets')
			.insert({ user_id: locals.user.id, balance: 0, bonus_balance: 0 })
			.select()
			.single();
		wallet = newWallet;
	}

	return { wallet, transactions: txRes.data || [] };
}
