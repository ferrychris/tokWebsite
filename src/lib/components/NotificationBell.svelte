<script lang="ts">
	import { notifications, unreadCount, markAsRead, markAllAsRead, loadNotifications, subscribeToNotifications, unsubscribeFromNotifications } from '$lib/stores/notifications';
	import { onMount, onDestroy } from 'svelte';

	let open = $state(false);

	function close() { open = false; }

	function toggle() { open = !open; }

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('[data-notif-bell]')) close();
	}

	onMount(() => {
		loadNotifications();
		subscribeToNotifications();
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		unsubscribeFromNotifications();
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div data-notif-bell class="relative">
	<button
		onclick={toggle}
		class="relative p-1.5 rounded-lg hover:bg-[#1D1D22] text-[#9E9EA7] hover:text-white transition-colors"
	>
		<svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a9.04 9.04 0 0 1-1.666-6.679V7.5a3.375 3.375 0 0 0-6.75 0v2.903c0 2.404-.907 4.708-2.636 6.679M14.857 17.082a9.04 9.04 0 0 0 2.23 6.679m-2.23-6.679H5.25m9.04 0a2.25 2.25 0 0 1-4.474 0m.059 0a2.25 2.25 0 0 1 4.474 0" />
		</svg>
		{#if $unreadCount > 0}
			<span class="absolute -top-0.5 -right-0.5 h-4 min-w-[1rem] px-1 rounded-full bg-[#FF2A54] text-white text-[10px] font-bold flex items-center justify-center">
				{$unreadCount > 9 ? '9+' : $unreadCount}
			</span>
		{/if}
	</button>

	{#if open}
		<div class="absolute right-0 top-full mt-2 w-80 bg-[#131316] border border-[#232326] rounded-xl shadow-2xl z-50 overflow-hidden">
			<div class="flex items-center justify-between px-4 py-3 border-b border-[#232326]">
				<span class="text-sm font-semibold text-white">Notifications</span>
				{#if $unreadCount > 0}
					<button onclick={markAllAsRead} class="text-xs text-[#FF2A54] hover:underline flex items-center gap-1">
						<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
						</svg> Mark all read
					</button>
				{/if}
			</div>

			<div class="max-h-80 overflow-y-auto">
				{#if $notifications.length === 0}
					<div class="p-8 text-center text-sm text-gray-500">No notifications yet</div>
				{:else}
					{#each $notifications as notif}
						<button
							onclick={() => { if (!notif.read) markAsRead(notif.id); }}
							class="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-[#1A1A22] {notif.read ? '' : 'bg-[#FF2A54]/[0.03]'}"
						>
							<div class="mt-0.5 shrink-0 {notif.read ? 'text-gray-500' : 'text-[#FF2A54]'}">
								{#if notif.type === 'new_task'}
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
										<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
									</svg>
								{:else if notif.type === 'campaign_update'}
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19.113 12.097A9.001 9.001 0 0112 21.75c-1.905 0-3.68-.59-5.143-1.597l2.846-2.847A5.98 5.98 0 0012 17.25c2.44 0 4.506-1.455 5.429-3.535l1.684-1.618z" />
										<path stroke-linecap="round" stroke-linejoin="round" d="M19.113 12.097c.376-.376.67-.827.87-1.325.263-.658.263-1.396 0-2.054a3.744 3.744 0 00-.87-1.325l-1.684 1.618A5.98 5.98 0 0012 6.75c-2.44 0-4.506 1.455-5.429 3.535L3.725 7.438a9.001 9.001 0 0115.388 4.659z" />
									</svg>
								{:else if notif.type === 'payment'}
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
									</svg>
								{:else}
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 1 1 1.062 1.06l-.969 1.5c-.322.502-.128 1.183.42 1.439l.041.02a.75.75 0 1 1-.58 1.383l-.041-.02a2.25 2.25 0 0 1-1.259-2.986l.969-1.5a.75.75 0 0 0-.256-.998l-.041-.02a.75.75 0 0 1-.362-1.018l.041-.02ZM12 8.25h.008v.008H12V8.25Z" />
										<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
									</svg>
								{/if}
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-white truncate">{notif.title}</p>
								<p class="text-xs text-gray-400 mt-0.5 line-clamp-2">{notif.body}</p>
								<p class="text-[10px] text-gray-600 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
							</div>
							{#if !notif.read}
								<span class="h-2 w-2 rounded-full bg-[#FF2A54] shrink-0 mt-1.5"></span>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
