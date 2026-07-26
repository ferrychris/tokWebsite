import { redirect } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/server/welcomeEmail';

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

			// Safety net only — the on_auth_user_created trigger normally creates
			// both of these before this code ever runs.
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

			// Welcome email for OAuth signups. Claiming the row first means
			// returning Google users don't get a second copy.
			const { data: claimed } = await locals.supabase
				.from('profiles')
				.update({ welcome_email_sent_at: new Date().toISOString() })
				.eq('id', userId)
				.is('welcome_email_sent_at', null)
				.select('email, name')
				.maybeSingle();

			if (claimed) {
				const result = await sendWelcomeEmail(claimed.email, claimed.name);
				if (!result.sent) {
					await locals.supabase
						.from('profiles')
						.update({ welcome_email_sent_at: null })
						.eq('id', userId);
				}
			}
		}
		throw redirect(303, next);
	}

	throw redirect(303, '/login');
}
