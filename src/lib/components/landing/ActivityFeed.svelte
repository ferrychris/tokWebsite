<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	const names = [
		'xX_Gamer_Xx', 'MusicMaven', 'StreamKing', 'xxveQueeXX', 'RapGod',
		'DJ_Phantom', 'ArtVibes', 'CodeStream', 'FitFam_Live', 'BeautyBloom',
		'xRageQuitx', 'ProSniper_22', 'Live_Her0', 'xxShad0wxx', 'NeoN_Rage',
		'Shifted_God', 'Stream_col', 'Pulse_21', 'Mega_Bitzz', 'KingKong_17',
		'xx_FaZe_xx', 'Blaze_It_Up', 'Vibe_Check', 'Soul_Byte', 'Byte_Shift',
		'Lunar_Eclipse', 'Star_Drifter', 'Neural_Link', 'Pixel_Witch', 'Frost_Bite',
		'Volt_Rush', 'Echo_Base', 'Quantum_Fx', 'Rift_Walker', 'Dusk_Fall',
	];
	const actions = [
		(n: number) => `got ${n} engagers`,
		(n: number) => `received ${n} live viewers`,
		(n: number) => `tipped ${n} engagers`,
		(n: number) => `just hit ${n} engagements`,
		(n: number) => `earned ${n} viewer tips`,
		(n: number) => `unlocked ${n} live engagements`,
		(n: number) => `boosted ${n} viewer connections`,
	];
	const amounts = [5, 7, 10, 12, 15, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 125, 130, 140, 150, 160, 170, 175, 180, 190, 200, 210, 220, 225, 230, 240, 250, 275, 300, 350, 400, 450, 500];

	let batch = $state<{ id: number; name: string; text: string }[]>([]);
	let batchId = $state(0);

	function pick<T>(arr: T[]): T {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	function showBatch() {
		const count = Math.random() > 0.5 ? 1 : 2;
		const items = Array.from({ length: count }, () => ({
			id: ++batchId,
			name: pick(names),
			text: pick(actions)(pick(amounts))
		}));
		batch = items;

		setTimeout(() => {
			batch = [];
		}, 4500);
	}

	onMount(() => {
		showBatch();
		const interval = setInterval(showBatch, 7000 + Math.random() * 3000);
		return () => clearInterval(interval);
	});
</script>

<div class="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
	{#each batch as n (n.id)}
		<div
			class="transition-all duration-500"
			in:fly={{ x: -20, duration: 400 }}
			out:fly={{ x: -20, duration: 300 }}
		>
			<div class="bg-[#131316]/90 border border-[#232326] rounded-xl px-4 py-3 backdrop-blur-md shadow-lg shadow-black/30 flex items-center gap-3">
				<div class="w-8 h-8 rounded-full bg-[#FF2A54]/15 flex items-center justify-center shrink-0">
					<svg class="h-4 w-4 text-[#FF2A54]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
					</svg>
				</div>
				<div class="text-sm leading-tight min-w-0">
					<span class="font-semibold text-white">{n.name}</span>
					<span class="text-gray-400"> {n.text}</span>
				</div>
			</div>
		</div>
	{/each}
</div>
