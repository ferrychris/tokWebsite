import { createClient } from '$lib/supabase/server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createClient(event.cookies);

	const { data: { session } } = await event.locals.supabase.auth.getSession();
	event.locals.user = session?.user ? { id: session.user.id, email: session.user.email! } : null;

	if (event.locals.user) {
		const { data: profile } = await event.locals.supabase
			.from('profiles')
			.select('*')
			.eq('id', event.locals.user.id)
			.single();
		event.locals.profile = profile ?? null;
	} else {
		event.locals.profile = null;
	}

	return resolve(event);
};
