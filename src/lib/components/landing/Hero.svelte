<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, createTimeline, stagger, svg } from 'animejs';
	import Button from '$lib/components/ui/button.svelte';

	let { data = null } = $props();
	let stats = $derived(data?.stats || { streams_hosted: 500000, average_growth: 85, paid_to_creators: 2000000 });

	let chartPath: SVGPathElement;
	let chartFill: SVGPolygonElement;
	let chartDots: SVGCircleElement[] = [];
	let liveDot: SVGCircleElement;
	let liveDotPing: SVGCircleElement;
	let avatarEls: HTMLElement[] = [];
	let activeViewers = $state(0);
	let avgWatch = $state(0);

	const CHART_POINTS = '0,70 40,55 80,60 120,35 160,42 200,20 240,28 280,8';
	const CHART_VERTICES = CHART_POINTS.split(' ').map((p) => {
		const [x, y] = p.split(',').map(Number);
		return { x, y };
	});

	onMount(() => {
		if (chartPath) {
			const tl = createTimeline({ defaults: { ease: 'outQuint' } });

			tl.add(svg.createDrawable(chartPath), {
				draw: ['0 0', '0 1'],
				duration: 1800
			})
				.add(
					chartFill,
					{
						opacity: [0, 1],
						duration: 900,
						ease: 'outQuad'
					},
					'-=1400'
				)
				.add(
					chartDots,
					{
						scale: [0, 1],
						opacity: [0, 1],
						duration: 500,
						delay: stagger(90),
						ease: 'outBack'
					},
					'-=600'
				)
				.add(
					[liveDot, liveDotPing],
					{
						opacity: [0, 1],
						duration: 300
					},
					'-=200'
				);

			animate(liveDotPing, {
				scale: [1, 2.4],
				opacity: [0.6, 0],
				duration: 1400,
				loop: true,
				ease: 'outSine',
				delay: 2200
			});
		}

		if (avatarEls.length) {
			animate(avatarEls, {
				opacity: [0, 1],
				translateY: [12, 0],
				delay: stagger(120, { start: 400 }),
				duration: 600,
				ease: 'outQuad'
			});
		}

		const counter = { viewers: 0, watch: 0 };
		animate(counter, {
			viewers: 1284,
			watch: 252,
			duration: 1600,
			ease: 'outExpo',
			onUpdate: () => {
				activeViewers = Math.round(counter.viewers);
				avgWatch = Math.round(counter.watch);
			}
		});
	});

	function fmt(n: number): string {
		if (n >= 1000000) return (n / 1000000) + 'M+';
		if (n >= 1000) return (n / 1000) + 'K+';
		return n.toString();
	}

	function fmtWatch(seconds: number): string {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}m ${s}s`;
	}
</script>

<section class="relative bg-[#0A0A0C] text-white py-20 lg:py-28 overflow-hidden">
	<div class="absolute top-1/4 left-1/10 w-96 h-96 bg-[#FF2A54]/10 rounded-full filter blur-[100px] pointer-events-none animate-pulse-glow"></div>
	<div class="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-purple-600/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow-delayed"></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
			<!-- Left column -->
			<div class="lg:col-span-6 text-left space-y-6">
				<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#232326] bg-[#131316]/60 backdrop-blur-md animate-fade-up">
					<span class="relative flex h-2 w-2">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2A54] opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-[#FF2A54]"></span>
					</span>
					<span class="text-xs font-medium text-gray-300 tracking-wide">Live Traffic Engine Active</span>
				</div>

				<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white animate-fade-up-lg">
					Drive Traffic To
					<span class="bg-gradient-to-r from-[#FF2A54] to-purple-500 bg-clip-text text-transparent">Your TikTok</span>
					Livestreams
				</h1>

				<p class="text-lg text-gray-400 max-w-xl leading-relaxed animate-fade-up animate-delay-100">
					Launch viewer acquisition campaigns, measure watch time, and connect with genuine audiences to grow your stream. The pro-grade platform for serious creators.
				</p>

				<div class="flex flex-wrap items-center gap-4 pt-2 animate-fade-up animate-delay-200">
					<a href="/register">
						<Button class="bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 text-base font-semibold px-8 py-3.5 h-auto rounded-xl shadow-[0_0_20px_rgba(255,42,84,0.4)] transition-all hover:scale-105 active:scale-95">
							Get Started
						</Button>
					</a>

				</div>

				<div class="flex items-center gap-3 pt-4">
					<div class="flex -space-x-3">
						{#each Array.from({ length: 4 }) as _, i}
							<div bind:this={avatarEls[i]} class="w-9 h-9 rounded-full border-2 border-[#0A0A0C] opacity-0" style="background: linear-gradient(135deg, hsl({20 + i * 60} 80% 55%), hsl({80 + i * 60} 70% 45%));"></div>
						{/each}
					</div>
					<span class="text-sm text-gray-400">
						<span class="text-white font-semibold">+2,400</span> creators growing today
					</span>
				</div>
			</div>

			<!-- Right column: Live stat card -->
			<div class="lg:col-span-6 animate-fade-up animate-delay-300">
				<div class="relative rounded-2xl border border-[#232326] bg-[#131316]/70 backdrop-blur-md p-6 shadow-2xl shadow-black/40">
					<div class="flex items-center justify-between mb-4">
						<span class="text-sm font-medium text-gray-400">Last 24 Hours</span>
						<div class="p-1.5 rounded-full bg-[#FF2A54]/10 border border-[#FF2A54]/20">
							<svg class="h-3.5 w-3.5 text-[#FF2A54]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
					</div>

					<div class="rounded-xl bg-black/30 border border-white/5 p-4 mb-5">
						<svg viewBox="0 0 280 90" class="w-full h-24" preserveAspectRatio="none">
							<defs>
								<linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color="#FF2A54" stop-opacity="0.35" />
									<stop offset="100%" stop-color="#FF2A54" stop-opacity="0" />
								</linearGradient>
							</defs>
							<polygon bind:this={chartFill} points="{CHART_POINTS} 280,90 0,90" fill="url(#chart-fill)" opacity="0" />
							<polyline bind:this={chartPath} points={CHART_POINTS} fill="none" stroke="#FF2A54" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
							{#each CHART_VERTICES.slice(0, -1) as v, i}
								<circle bind:this={chartDots[i]} cx={v.x} cy={v.y} r="3" fill="#FF2A54" opacity="0" style="transform-origin: {v.x}px {v.y}px;" />
							{/each}
							<circle bind:this={liveDotPing} cx={CHART_VERTICES[CHART_VERTICES.length - 1].x} cy={CHART_VERTICES[CHART_VERTICES.length - 1].y} r="4" fill="none" stroke="#FF2A54" stroke-width="1.5" opacity="0" style="transform-origin: {CHART_VERTICES[CHART_VERTICES.length - 1].x}px {CHART_VERTICES[CHART_VERTICES.length - 1].y}px;" />
							<circle bind:this={liveDot} cx={CHART_VERTICES[CHART_VERTICES.length - 1].x} cy={CHART_VERTICES[CHART_VERTICES.length - 1].y} r="4" fill="#FF2A54" opacity="0" />
						</svg>
						<div class="flex justify-between mt-2 text-[10px] uppercase tracking-wide text-gray-500">
							<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="rounded-xl bg-black/30 border border-white/5 p-4">
							<div class="text-xs text-gray-400 mb-1">Active Viewers</div>
							<div class="text-2xl font-extrabold text-white">{activeViewers.toLocaleString()}</div>
							<div class="text-xs text-emerald-400 mt-1">+12% vs last stream</div>
						</div>
						<div class="rounded-xl bg-black/30 border border-white/5 p-4">
							<div class="text-xs text-gray-400 mb-1">Avg. Watch Time</div>
							<div class="text-2xl font-extrabold text-white">{fmtWatch(avgWatch)}</div>
							<div class="text-xs text-emerald-400 mt-1">+6K retention</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Stats Section -->
		<div class="mt-16 lg:mt-20 bg-[#131316] border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-md animate-fade-up-lg animate-delay-500">
			<div class="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
				<div class="flex items-center justify-center gap-6 w-full md:w-auto">
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

				<div class="flex items-center justify-center gap-6 w-full md:w-auto">
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

				<div class="flex items-center justify-center gap-6 w-full md:w-auto">
					<div class="text-[#FF2A54] text-5xl font-medium">$</div>
					<div class="text-left">
						<div class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{fmt(stats.paid_to_creators)}</div>
						<div class="text-sm text-gray-400 font-medium mt-1">Paid to Creators</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
