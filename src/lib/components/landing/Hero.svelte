<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';

	let { data = null } = $props();
	let stats = $derived(data?.stats || { streams_hosted: 500000, average_growth: 85, paid_to_creators: 2000000 });

	function fmt(n: number): string {
		return n.toLocaleString();
	}
</script>

<section class="relative bg-[#0A0A0C] text-white py-20 lg:py-32 overflow-hidden">
	<div class="absolute top-1/4 left-1/10 w-96 h-96 bg-[#FF2A54]/10 rounded-full filter blur-[100px] pointer-events-none animate-pulse-glow"></div>
	<div class="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-purple-600/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow-delayed"></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="grid lg:grid-cols-12 gap-12 items-center">
			<div class="lg:col-span-7 text-left space-y-6">
				<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white animate-fade-up-lg">
					Drive Traffic To <br/>
					Your <span class="text-white bg-clip-text bg-gradient-to-r from-white via-white to-white">TikTok Livestreams</span>
				</h1>
				<p class="text-lg text-gray-400 max-w-xl leading-relaxed animate-fade-up animate-delay-100">
					Launch viewer acquisition campaigns, measure watch time, and connect with genuine audiences to grow your stream.
				</p>

				<div class="pt-4 animate-fade-up animate-delay-200">
					<a href="/register">
						<Button class="bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 text-sm font-semibold px-5 py-2.5 h-auto rounded-lg shadow-lg shadow-[#FF2A54]/20 transition-all hover:scale-105 active:scale-95">
							Start for Creators
						</Button>
					</a>
				</div>
			</div>

			<div class="lg:col-span-5 relative flex justify-center items-center h-[350px] md:h-[400px] animate-fade-up animate-delay-300">
				<div class="absolute w-72 h-72 bg-[#FF2A54]/20 rounded-full filter blur-[80px] mix-blend-screen opacity-70 animate-float"></div>
				<div class="absolute w-80 h-80 bg-purple-500/20 rounded-full filter blur-[100px] mix-blend-screen opacity-60 translate-x-10 translate-y-10 animate-float-delayed"></div>

				<svg class="w-full h-full max-w-[420px] filter drop-shadow-[0_0_35px_rgba(255,42,84,0.4)] animate-float-slow" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M120 400 C 180 280, 320 220, 380 100" stroke="url(#hero-ribbon-1)" stroke-width="24" stroke-linecap="round" />
					<path d="M90 360 C 200 280, 300 200, 410 120" stroke="url(#hero-ribbon-2)" stroke-width="14" stroke-linecap="round" opacity="0.8" />
					<path d="M150 440 C 220 340, 280 260, 350 160" stroke="url(#hero-ribbon-3)" stroke-width="8" stroke-linecap="round" opacity="0.6" />
					<defs>
						<linearGradient id="hero-ribbon-1" x1="0%" y1="100%" x2="100%" y2="0%">
							<stop offset="0%" stop-color="#FF2A54" />
							<stop offset="60%" stop-color="#EC4899" />
							<stop offset="100%" stop-color="#8B5CF6" />
						</linearGradient>
						<linearGradient id="hero-ribbon-2" x1="0%" y1="100%" x2="100%" y2="0%">
							<stop offset="0%" stop-color="#3B82F6" />
							<stop offset="50%" stop-color="#8B5CF6" />
							<stop offset="100%" stop-color="#EC4899" />
						</linearGradient>
						<linearGradient id="hero-ribbon-3" x1="0%" y1="100%" x2="100%" y2="0%">
							<stop offset="0%" stop-color="#EF4444" />
							<stop offset="100%" stop-color="#F59E0B" />
						</linearGradient>
					</defs>
				</svg>
			</div>
		</div>

		<div class="mt-20 bg-[#131316]/50 border border-[#232326] rounded-2xl p-6 md:p-8 backdrop-blur-md animate-fade-up-lg animate-delay-500">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#232326]">
				<div class="flex items-center justify-center gap-5 py-4 md:py-0 md:px-6 animate-fade-up animate-delay-500">
					<div class="w-12 h-12 rounded-full bg-[#FF2A54]/15 flex items-center justify-center text-[#FF2A54] shadow-[0_0_15px_rgba(255,42,84,0.2)] group-hover:shadow-[0_0_25px_rgba(255,42,84,0.4)] transition-shadow">
						<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
							<path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
							<circle cx="12" cy="12" r="2"/>
							<path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
							<path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
						</svg>
					</div>
					<div class="text-left">
						<div class="text-2xl sm:text-3xl font-extrabold text-white">{fmt(stats.streams_hosted)}</div>
						<div class="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Streams Hosted</div>
					</div>
				</div>

				<div class="flex items-center justify-center gap-5 py-4 md:py-0 md:px-6 animate-fade-up animate-delay-700">
					<div class="w-12 h-12 rounded-full bg-[#FF2A54]/15 flex items-center justify-center text-[#FF2A54] shadow-[0_0_15px_rgba(255,42,84,0.2)]">
						<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
							<polyline points="17 6 23 6 23 12"/>
						</svg>
					</div>
					<div class="text-left">
						<div class="text-2xl sm:text-3xl font-extrabold text-white">{stats.average_growth}%</div>
						<div class="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Average Growth</div>
					</div>
				</div>

				<div class="flex items-center justify-center gap-5 py-4 md:py-0 md:px-6 animate-fade-up animate-delay-700">
					<div class="w-12 h-12 rounded-full bg-[#FF2A54]/15 flex items-center justify-center text-[#FF2A54] shadow-[0_0_15px_rgba(255,42,84,0.2)]">
						<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<line x1="12" y1="1" x2="12" y2="23"/>
							<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
						</svg>
					</div>
					<div class="text-left">
						<div class="text-2xl sm:text-3xl font-extrabold text-white">${fmt(stats.paid_to_creators)}</div>
						<div class="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Paid to Creators</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
