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
</script>

<footer bind:this={el} class="bg-[#0A0A0C] text-gray-500 py-10 border-t border-[#1C1C1E] text-sm reveal-on-scroll">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
			<div class="flex flex-wrap justify-center gap-8">
				<a href="#about" class="hover:text-white transition-colors">About Us</a>
				<a href="#support" class="hover:text-white transition-colors">Support</a>
				<a href="#privacy" class="hover:text-white transition-colors">Privacy</a>
				<a href="#terms" class="hover:text-white transition-colors">Terms</a>
			</div>
			<div class="text-gray-500">
				&copy; 2024 Soyomu Live
			</div>
		</div>
	</div>
</footer>
