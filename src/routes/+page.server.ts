export async function load({ locals }) {
	let stats = { streams_hosted: 500000, average_growth: 85, paid_to_creators: 2000000 };

	const { data } = await locals.supabase
		.from('platform_stats')
		.select('*')
		.single();
	if (data) stats = data;

	return { stats };
}
