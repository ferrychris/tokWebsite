export async function load({ locals }: { locals: App.Locals }) {
	const { data: campaigns } = await locals.supabase
		.from('campaigns')
		.select('*')
		.order('created_at', { ascending: false });

	return { campaigns: campaigns || [] };
}
