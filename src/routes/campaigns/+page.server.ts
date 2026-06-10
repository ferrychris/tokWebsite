export async function load({ locals }: { locals: App.Locals }) {
	if (!locals.user) return { campaigns: [] };

	const { data } = await locals.supabase
		.from('campaigns')
		.select('*')
		.eq('user_id', locals.user.id)
		.order('created_at', { ascending: false });

	return { campaigns: data || [] };
}
