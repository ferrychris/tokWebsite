import { redirect } from '@sveltejs/kit';

export async function load({ url, locals }: { url: URL; locals: App.Locals }) {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') || '/dashboard';

	if (code) {
		const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error && data.session) {
			const userId = data.session.user.id;
			const { data: existingProfile } = await locals.supabase
				.from('profiles')
				.select('id')
				.eq('id', userId)
				.single();

			if (!existingProfile) {
				const { data: { user: u } } = await locals.supabase.auth.getUser();
				await locals.supabase.from('profiles').insert({
					id: userId,
					email: u?.email || '',
					name: u?.user_metadata?.name || u?.email?.split('@')[0] || 'User',
					role: 'creator'
				});
				await locals.supabase.from('wallets').insert({
					user_id: userId,
					balance: 0,
					bonus_balance: 0
				});
			}
		}
		throw redirect(303, next);
	}

	throw redirect(303, '/login');
}
