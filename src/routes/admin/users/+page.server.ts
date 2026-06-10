export async function load({ locals }: { locals: App.Locals }) {
	const { data: profiles } = await locals.supabase.from('profiles').select('*').order('created_at', { ascending: false });
	const { data: wallets } = await locals.supabase.from('wallets').select('*');

	const walletMap = new Map((wallets || []).map((w: any) => [w.user_id, w]));

	return {
		users: (profiles || []).map((p: any) => ({
			...p,
			wallet: walletMap.get(p.id) || null
		}))
	};
}
