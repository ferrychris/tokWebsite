import type { Profile } from '$lib/supabase/types';

declare global {
	namespace App {
		interface Locals {
			supabase: import('@supabase/ssr').SupabaseClient;
			user: { id: string; email: string } | null;
			profile: Profile | null;
		}
		interface PageData {
			user: { id: string; email: string } | null;
			profile: Profile | null;
		}
	}
}

export {};
