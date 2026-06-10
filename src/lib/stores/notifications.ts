import { writable, get } from 'svelte/store';
import { createClient } from '$lib/supabase/client';
import type { Notification } from '$lib/supabase/types';
import { user } from './auth';

let supabase = createClient();

export const notifications = writable<Notification[]>([]);
export const unreadCount = writable(0);

let channel: ReturnType<typeof supabase.channel> | null = null;

export async function loadNotifications() {
	const u = get(user);
	if (!u) return;

	const { data } = await supabase
		.from('notifications')
		.select('*')
		.eq('user_id', u.id)
		.order('created_at', { ascending: false })
		.limit(20);

	if (data) {
		notifications.set(data);
		unreadCount.set(data.filter((n: Notification) => !n.read).length);
	}
}

export function subscribeToNotifications() {
	const u = get(user);
	if (!u || channel) return;

	channel = supabase
		.channel('notifications')
		.on('postgres_changes',
			{ event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${u.id}` },
			(payload: any) => {
				const notif = payload.new as Notification;
				notifications.update(list => [notif, ...list]);
				unreadCount.update(c => c + 1);
			}
		)
		.subscribe();
}

export function unsubscribeFromNotifications() {
	if (channel) {
		supabase.removeChannel(channel);
		channel = null;
	}
}

export async function markAsRead(id: string) {
	await supabase.from('notifications').update({ read: true }).eq('id', id);
	notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
	unreadCount.update(c => Math.max(0, c - 1));
}

export async function markAllAsRead() {
	const u = get(user);
	if (!u) return;
	await supabase.from('notifications').update({ read: true }).eq('user_id', u.id).is('read', false);
	notifications.update(list => list.map(n => ({ ...n, read: true })));
	unreadCount.set(0);
}
