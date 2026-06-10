import { writable, get } from 'svelte/store';
import { createClient } from '$lib/supabase/client';
import { goto } from '$app/navigation';

export const user = writable<{ id: string; email: string } | null>(null);
export const profile = writable<any>(null);
export const loading = writable(false);

let supabase = createClient();

export function initAuth(data: { user: { id: string; email: string } | null; profile: any | null }) {
	user.set(data.user);
	profile.set(data.profile);
	loading.set(false);
}

export async function loadSession() {
	loading.set(true);
	try {
		const { data: { session } } = await supabase.auth.getSession();
		if (session?.user) {
			user.set({ id: session.user.id, email: session.user.email! });
			const { data: prof } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', session.user.id)
				.single();
			if (prof) profile.set(prof);
		} else {
			user.set(null);
			profile.set(null);
		}
	} catch (e) {
		console.error('Failed to load session', e);
	} finally {
		loading.set(false);
	}
}

export async function loadProfile() {
	const u = get(user);
	if (!u) return;
	const { data } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', u.id)
		.single();
	if (data) profile.set(data);
}

export async function signOut() {
	await supabase.auth.signOut();
	user.set(null);
	profile.set(null);
	goto('/login');
}
