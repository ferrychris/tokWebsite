export async function load({ locals }: { locals: App.Locals }) {
	if (!locals.user) return { campaigns: [], stats: null };

	const { data: campaigns } = await locals.supabase
		.from('campaigns')
		.select('*')
		.eq('user_id', locals.user.id)
		.order('created_at', { ascending: false });

	const all = campaigns || [];
	const nonDraft = all.filter((c: any) => c.status !== 'draft');
	const totalViewers = nonDraft.reduce((s: number, c: any) => s + (c.viewers_requested || 0), 0);
	const totalDelivered = nonDraft.reduce((s: number, c: any) => s + (c.viewers_delivered || 0), 0);
	const totalSpend = nonDraft.reduce((s: number, c: any) => s + (c.cost || 0), 0);
	const completed = nonDraft.filter((c: any) => c.status === 'completed').length;
	const completionRate = nonDraft.length > 0 ? Math.round((completed / nonDraft.length) * 100) : 0;
	const deliveryRate = totalViewers > 0 ? Math.round((totalDelivered / totalViewers) * 100) : 0;

	return {
		campaigns: all,
		stats: {
			totalViewers,
			totalDelivered,
			totalSpend,
			completed,
			completionRate,
			deliveryRate,
			totalCampaigns: nonDraft.length
		}
	};
}
