export async function load({ locals }: { locals: App.Locals }) {
	if (!locals.user) return { user: null, profile: null, wallet: null, campaigns: [], stats: null };

	const supabase = locals.supabase;

	let [walletRes, campaignsRes] = await Promise.all([
		supabase.from('wallets').select('*').eq('user_id', locals.user.id).maybeSingle(),
		supabase.from('campaigns').select('*').eq('user_id', locals.user.id).order('created_at', { ascending: false })
	]);

	let wallet = walletRes.data;
	if (!wallet) {
		const { data: newWallet } = await supabase
			.from('wallets')
			.insert({ user_id: locals.user.id, balance: 0, bonus_balance: 0 })
			.select()
			.single();
		wallet = newWallet;
	}

	const campaigns = campaignsRes.data || [];
	const nonDraft = campaigns.filter((c: any) => c.status !== 'draft');
	const totalViewersDelivered = nonDraft.reduce((sum: number, c: any) => sum + (c.viewers_delivered || 0), 0);
	const totalSpend = nonDraft.reduce((sum: number, c: any) => sum + (c.cost || 0), 0);
	const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
	const completedCampaigns = campaigns.filter((c: any) => c.status === 'completed').length;

	return {
		user: locals.user,
		profile: locals.profile,
		wallet,
		campaigns,
		stats: {
			totalViewersDelivered,
			totalSpend,
			activeCampaigns,
			completedCampaigns,
			totalCampaigns: nonDraft.length
		}
	};
}
