import { createServerClient } from '@supabase/ssr';
import { type Cookies } from '@sveltejs/kit';
import type { Database } from './types';

export function createClient(cookies: Cookies) {
	return createServerClient(
		import.meta.env.VITE_SUPABASE_URL!,
		import.meta.env.VITE_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	) as any;
}
