export async function load({ locals }: { locals: App.Locals }) {
	const [profilesRes, campaignsRes, walletsRes, txRes] = await Promise.all([
		locals.supabase.from('profiles').select('*'),
		locals.supabase.from('campaigns').select('*'),
		locals.supabase.from('wallets').select('*'),
		locals.supabase.from('transactions').select('*')
	]);

	const profiles = profilesRes.data || [];
	const campaigns = campaignsRes.data || [];
	const wallets = walletsRes.data || [];
	const transactions = txRes.data || [];

	const totalBalance = wallets.reduce((s: number, w: any) => s + (w.balance || 0), 0);
	const totalBonus = wallets.reduce((s: number, w: any) => s + (w.bonus_balance || 0), 0);
	const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
	const pendingDeposits = transactions.filter((t: any) => t.type === 'deposit' && t.status === 'pending').length;

	return {
		stats: {
			totalUsers: profiles.length,
			totalCampaigns: campaigns.length,
			activeCampaigns,
			totalBalance,
			totalBonus,
			pendingDeposits,
			totalRevenue: transactions.filter((t: any) => t.type === 'deposit' && t.status === 'completed')
				.reduce((s: number, t: any) => s + t.amount, 0)
		}
	};
}
