<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';

	let { data = null } = $props();
	let stats = $derived(data?.stats || { streams_hosted: 500000, average_growth: 85, paid_to_creators: 2000000 });

	const activities = [
		{ username: 'Soul_Byte', viewers: '120k' },
		{ username: 'KingKong_17', viewers: '1k' }
	];

	function fmt(n: number): string {
		if (n >= 1000000) return (n / 1000000) + 'M+';
		if (n >= 1000) return (n / 1000) + 'K+';
		return n.toString();
	}
</script>

<section class="relative bg-[#0A0A0C] text-white py-20 lg:py-32 overflow-hidden">
	<div class="absolute top-1/4 left-1/10 w-96 h-96 bg-[#FF2A54]/10 rounded-full filter blur-[100px] pointer-events-none animate-pulse-glow"></div>
	<div class="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-purple-600/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow-delayed"></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="grid lg:grid-cols-12 gap-8 items-center">
			<div class="lg:col-span-5 text-left space-y-6">
				<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white animate-fade-up-lg">
					Drive Traffic To <br/>
					Your TikTok <br/>
					Livestreams
				</h1>
				<p class="text-lg text-gray-400 max-w-xl leading-relaxed animate-fade-up animate-delay-100">
					Launch viewer acquisition campaigns, measure watch time, and connect with genuine audiences to grow your stream.
				</p>

				<div class="flex pt-6 animate-fade-up animate-delay-200">
					<a href="/dashboard">
						<Button class="bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 text-base font-semibold w-64 py-6 h-auto rounded-xl shadow-[0_0_20px_rgba(255,42,84,0.4)] transition-all hover:scale-105 active:scale-95">
							Get Started
						</Button>
					</a>
				</div>
			</div>

			<div class="lg:col-span-7 relative flex justify-center items-center h-[400px] md:h-[450px] animate-fade-up animate-delay-300">
				<div class="absolute w-72 h-72 bg-[#FF2A54]/20 rounded-full filter blur-[80px] mix-blend-screen opacity-70 animate-float"></div>
				<div class="absolute w-80 h-80 bg-purple-500/20 rounded-full filter blur-[100px] mix-blend-screen opacity-60 translate-x-10 translate-y-10 animate-float-delayed"></div>

				<!-- Animated Globe -->
				<svg class="w-full h-full max-w-[420px] filter drop-shadow-[0_0_35px_rgba(255,42,84,0.4)] animate-float-slow absolute" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
					<!-- Grid pattern -->
					<defs>
						<radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stop-color="#A855F7" />
							<stop offset="100%" stop-color="#EC4899" />
						</radialGradient>
						<filter id="glow">
							<feGaussianBlur stdDeviation="3" result="coloredBlur"/>
							<feMerge>
								<feMergeNode in="coloredBlur"/>
								<feMergeNode in="SourceGraphic"/>
							</feMerge>
						</filter>
					</defs>

					<!-- Circles for globe effect -->
					<circle cx="250" cy="250" r="180" fill="none" stroke="url(#globe-glow)" stroke-width="0.5" opacity="0.3"/>
					<circle cx="250" cy="250" r="160" fill="none" stroke="url(#globe-glow)" stroke-width="0.5" opacity="0.4"/>
					<circle cx="250" cy="250" r="140" fill="none" stroke="url(#globe-glow)" stroke-width="0.5" opacity="0.5"/>
					<circle cx="250" cy="250" r="120" fill="none" stroke="url(#globe-glow)" stroke-width="1" opacity="0.6"/>
					<circle cx="250" cy="250" r="100" fill="none" stroke="url(#globe-glow)" stroke-width="1" opacity="0.7"/>

					<!-- Dots pattern -->
					{#each Array.from({length: 200}) as _, i}
						{@const angle = (i / 200) * Math.PI * 2}
						{@const radius = 100 + Math.sin(i * 0.5) * 40}
						{@const x = 250 + Math.cos(angle) * radius}
						{@const y = 250 + Math.sin(angle) * radius}
						<circle cx={x} cy={y} r="1.5" fill="url(#globe-glow)" opacity="0.8"/>
					{/each}
				</svg>

				<!-- Activity Cards Overlay -->
				<!-- Left Card -->
				<div class="absolute left-8 md:left-16 lg:left-24 top-1/4 z-20 animate-fade-up-lg animate-delay-500">
					<div class="px-5 py-3 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
						<div class="flex flex-col">
							<span class="text-white text-sm font-medium tracking-wide">{activities[0].username}</span>
							<span class="text-gray-400 text-xs mt-1">drew <span class="text-white">{activities[0].viewers}</span> viewers</span>
						</div>
					</div>
				</div>

				<!-- Right Card -->
				<div class="absolute right-8 md:right-16 lg:right-24 bottom-1/3 z-20 animate-fade-up-lg animate-delay-700">
					<div class="px-5 py-3 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
						<div class="flex flex-col text-right">
							<span class="text-white text-sm font-medium tracking-wide">{activities[1].username}</span>
							<span class="text-gray-400 text-xs mt-1">drew <span class="text-white">{activities[1].viewers}</span> viewers</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Stats Section -->
		<div class="mt-20 bg-[#131316] border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-md animate-fade-up-lg animate-delay-500">
			<div class="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
				<!-- Streams Hosted -->
				<div class="flex items-center justify-center gap-6 animate-fade-up animate-delay-500 w-full md:w-auto">
					<div class="text-[#FF2A54]">
						<svg class="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
							<path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
							<circle cx="12" cy="12" r="2"/>
							<path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
							<path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
						</svg>
					</div>
					<div class="text-left">
						<div class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{fmt(stats.streams_hosted)}</div>
						<div class="text-sm text-gray-400 font-medium mt-1">Streams Hosted</div>
					</div>
				</div>

				<!-- Average Growth -->
				<div class="flex items-center justify-center gap-6 animate-fade-up animate-delay-700 w-full md:w-auto">
					<div class="text-[#FF2A54]">
						<svg class="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
							<polyline points="17 6 23 6 23 12"/>
						</svg>
					</div>
					<div class="text-left">
						<div class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{stats.average_growth}%</div>
						<div class="text-sm text-gray-400 font-medium mt-1">Average Growth</div>
					</div>
				</div>

				<!-- Paid to Creators -->
				<div class="flex items-center justify-center gap-6 animate-fade-up animate-delay-700 w-full md:w-auto">
					<div class="text-[#FF2A54] text-5xl font-medium">
						$
					</div>
					<div class="text-left">
						<div class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{fmt(stats.paid_to_creators)}</div>
						<div class="text-sm text-gray-400 font-medium mt-1">Paid to Creators</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
