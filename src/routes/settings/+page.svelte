<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Separator from '$lib/components/ui/separator.svelte';
	import { createClient } from '$lib/supabase/client';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let name = $state(data.profile?.name || '');
	let tiktokUsername = $state(data.profile?.tiktok_username || '');
	let saving = $state(false);
	let saved = $state(false);
	let error = $state('');

	const supabase = createClient();

	async function handleSave() {
		saving = true;
		saved = false;
		error = '';
		try {
			const { error: updateError } = await supabase
				.from('profiles')
				.update({ name, tiktok_username: tiktokUsername || undefined })
				.eq('id', data.user!.id);
			if (updateError) throw updateError;
			await invalidateAll();
			saved = true;
		} catch (e: any) {
			error = e.message;
		} finally {
			saving = false;
		}
	}
</script>

<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-3xl font-bold mb-2">Settings</h1>
	<p class="text-muted-foreground mb-8">Manage your account settings</p>

	<Card>
		<div class="p-6 space-y-6">
			<div class="flex items-center gap-3">
				<svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43 1 .006.079.01.159.01.238 0 .079-.004.159-.01.238-.008.387.137.759.43 1l1.004.829a1.125 1.125 0 0 1 1.26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.37.491l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 1.26-1.43l1.004-.827c.292-.24.437-.613.43-1a6.9 6.9 0 0 1-.01-.238c0-.079.004-.159.01-.238.008-.387-.138-.759-.43-1l-1.004-.829a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<h2 class="text-xl font-semibold">Profile</h2>
			</div>
			<Separator />

			<div>
				<label class="block text-sm font-medium mb-2 flex items-center gap-2">
					<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
					</svg> Email
				</label>
				<input type="email" value={data.user?.email || ''} disabled class="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm" />
				<p class="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
			</div>

			<div>
				<label class="block text-sm font-medium mb-2 flex items-center gap-2">
					<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
					</svg> Name
				</label>
				<input type="text" bind:value={name} class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
			</div>

			<div>
				<label class="block text-sm font-medium mb-2 flex items-center gap-2">
					<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
					</svg> TikTok Username
				</label>
				<input type="text" bind:value={tiktokUsername} class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="@username" />
			</div>

			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}
			{#if saved}
				<p class="text-sm text-emerald-400">Settings saved successfully!</p>
			{/if}

			<Button onclick={handleSave} disabled={saving}>
				{#if saving}
					<svg class="h-4 w-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
				{/if}
				{saving ? 'Saving...' : 'Save Changes'}
			</Button>
		</div>
	</Card>
</div>
