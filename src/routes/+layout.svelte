<script lang="ts">
	import '../app.css';
	import { initAuth, loadSession, user as authUser } from '$lib/stores/auth';
	import { sidebarCollapsed } from '$lib/stores/sidebar';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/landing/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import AppNavbar from '$lib/components/AppNavbar.svelte';

	let { children, data } = $props();

	onMount(() => {
		if (data?.user) {
			initAuth(data);
		} else {
			loadSession();
		}
	});

	const isApp = $derived(
		$authUser && !['/login', '/register', '/'].includes($page.url.pathname)
	);
</script>

<div class="dark min-h-screen bg-[#0A0A0C] text-white">
	{#if isApp}
		<AppNavbar {data} />
		<div class="flex">
			<Sidebar {data} />
			<main class="flex-1 min-h-[calc(100vh-3.5rem)] transition-all duration-200" class:ml-60={!$sidebarCollapsed} class:ml-16={$sidebarCollapsed}>
				{@render children()}
			</main>
		</div>
	{:else}
		<Header {data} />
		<main class="min-h-screen">
			{@render children()}
		</main>
	{/if}
	<Toaster position="bottom-right" />
</div>
