<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';

	let { data }: { data: App.PageData } = $props();
	let mobileMenuOpen = $state(false);
</script>

<nav class="sticky top-0 z-50 border-b border-[#1F1F22] bg-[#0A0A0C]/90 backdrop-blur-md text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2.5 font-bold text-lg tracking-tight">
				<!-- Stylized Logo Icon -->
				<div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1E1E24] to-[#2D2D35] flex items-center justify-center border border-[#3D3D45] shrink-0">
					<svg class="h-4.5 w-4.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M30 20C45 20 55 35 55 50C55 65 45 80 30 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
						<path d="M70 20C55 20 45 35 45 50C45 65 55 80 70 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
					</svg>
				</div>
				<span class="text-white font-extrabold text-xl">Soyomu Live</span>
			</a>

			<!-- Navigation Links -->
			<div class="hidden md:flex items-center gap-8">
				<a href="#how-it-works" class="text-sm font-medium text-gray-400 hover:text-white transition-colors">How It Works</a>
			</div>

			<!-- CTAs -->
			<div class="hidden md:flex items-center gap-4">
				{#if data?.user}
					<a href="/dashboard">
						<Button class="bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 font-medium px-5">Dashboard</Button>
					</a>
				{:else}
					<a href="/login" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign In</a>
					<a href="/register">
						<Button class="bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 font-medium px-5">Get Started</Button>
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<button class="md:hidden text-gray-400 hover:text-white" onclick={() => mobileMenuOpen = !mobileMenuOpen} aria-label="Toggle mobile menu">
				{#if mobileMenuOpen}
					<!-- X Mark (Heroicon) -->
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<!-- Bars 3 / Menu (Heroicon) -->
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden border-t border-[#1F1F22] bg-[#0A0A0C] p-4 space-y-3">
			<a href="#how-it-works" onclick={() => mobileMenuOpen = false} class="block text-sm font-medium text-gray-400 hover:text-white py-1">How It Works</a>
			
			<div class="pt-2 border-t border-[#1F1F22] flex flex-col gap-2">
				{#if data?.user}
					<a href="/dashboard" onclick={() => mobileMenuOpen = false} class="w-full">
						<Button class="w-full bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 font-medium">Dashboard</Button>
					</a>
				{:else}
					<a href="/login" onclick={() => mobileMenuOpen = false} class="block text-center text-sm font-medium text-gray-300 hover:text-white py-2">Sign In</a>
					<a href="/register" onclick={() => mobileMenuOpen = false} class="w-full">
						<Button class="w-full bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 font-medium">Get Started</Button>
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
