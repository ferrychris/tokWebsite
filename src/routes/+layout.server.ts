import { redirect } from '@sveltejs/kit';

export function load({ locals, url }: { locals: App.Locals; url: URL }) {
	const protectedRoutes = ['/dashboard', '/wallet', '/campaigns', '/analytics', '/settings', '/admin'];
	const authRoutes = ['/login', '/register'];

	if (protectedRoutes.some(route => url.pathname.startsWith(route)) && !locals.user) {
		throw redirect(303, '/login');
	}

	if (url.pathname.startsWith('/admin') && locals.profile?.role !== 'admin') {
		throw redirect(303, '/dashboard');
	}

	if (authRoutes.some(route => url.pathname.startsWith(route)) && locals.user) {
		throw redirect(303, '/dashboard');
	}

	return {
		user: locals.user,
		profile: locals.profile
	};
}
