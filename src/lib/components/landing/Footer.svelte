<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed');
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.3 }
		);
		if (el) observer.observe(el);
		return () => observer.disconnect();
	});

	const columns = [
		{
			title: 'Product',
			links: [
				{ label: 'How It Works', href: '#how-it-works' },
				{ label: 'Pricing', href: '#pricing' },
				{ label: 'Features', href: '#features' }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'About Us', href: '#about' },
				{ label: 'Careers', href: '#careers' },
				{ label: 'Contact', href: '#contact' }
			]
		},
		{
			title: 'Account',
			links: [
				{ label: 'Sign In', href: '/login' },
				{ label: 'Get Started', href: '/register' },
				{ label: 'Privacy Policy', href: '#privacy' }
			]
		}
	];
</script>

<footer bind:this={el} class="bg-[#0A0A0C] text-gray-500 pt-16 pb-8 border-t border-[#1C1C1E] text-sm reveal-on-scroll">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid md:grid-cols-2 gap-10 mb-12">
			<div>
				<a href="/" class="flex items-center gap-2.5 font-bold text-lg tracking-tight text-white">
					<div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1E1E24] to-[#2D2D35] flex items-center justify-center border border-[#3D3D45] shrink-0">
						<svg class="h-4.5 w-4.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M30 20C45 20 55 35 55 50C55 65 45 80 30 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
							<path d="M70 20C55 20 45 35 45 50C45 65 55 80 70 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
						</svg>
					</div>
					<span class="text-white font-extrabold text-xl">Tikweb</span>
				</a>
				<p class="mt-4 max-w-xs text-gray-500">
					The pro-grade platform for driving traffic to your TikTok livestreams.
				</p>
			</div>

			<div class="grid grid-cols-3 gap-6">
				{#each columns as col}
					<div>
						<h4 class="text-white font-semibold text-sm mb-4">{col.title}</h4>
						<ul class="space-y-3">
							{#each col.links as link}
								<li><a href={link.href} class="hover:text-white transition-colors">{link.label}</a></li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<div class="pt-8 border-t border-[#1C1C1E] flex flex-col sm:flex-row items-center justify-between gap-4">
			<div class="text-gray-500">&copy; 2026 Tikweb. All rights reserved.</div>
			<div class="flex flex-wrap justify-center gap-6">
				<a href="#privacy" class="hover:text-white transition-colors">Privacy</a>
				<a href="#terms" class="hover:text-white transition-colors">Terms</a>
			</div>
		</div>
	</div>
</footer>
