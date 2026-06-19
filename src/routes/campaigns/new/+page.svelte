<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { enhance } from '$app/forms';
	import { VIEWER_PRESETS, DURATION_OPTIONS, DURATION_PRESETS, PRICE_PER_VIEWER, PRICE_PER_10MIN, MIN_SPEND, MAX_DURATION } from '$lib/utils/constants';

	let { form, data } = $props();
	let creating = $state(false);

	let step = $state(1);
	let tiktokUsername = $state(data.profile?.tiktok_username || '');

	function handleUsernameInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const val = target.value.trim();
		if (val.includes('tiktok.com/')) {
			const match = val.match(/@([^/]+)/);
			if (match && match[1]) {
				tiktokUsername = match[1];
				return;
			}
		}
		tiktokUsername = val.replace(/^@/, '');
	}

	const liveUrl = $derived(
		tiktokUsername.trim()
			? `https://www.tiktok.com/@${tiktokUsername.trim()}/live`
			: ''
	);

	let viewerInput = $state('');
	let selectedViewers = $state(10);
	let selectedDuration = $state(10);
	let scheduleDate = $state('');
	let scheduleTime = $state('');
	let scheduledAt = $derived(
		scheduleDate && scheduleTime
			? `${scheduleDate}T${scheduleTime}`
			: ''
	);

	const durationCost = $derived((selectedDuration / 10) * PRICE_PER_10MIN);
	const durationOption = $derived(DURATION_OPTIONS.find(o => o.value === selectedDuration));
	const durationLabel = $derived(durationOption?.label || `${selectedDuration}min`);
	const cost = $derived(selectedViewers * PRICE_PER_VIEWER + durationCost);
	const minViewers = $derived(Math.ceil(MIN_SPEND / PRICE_PER_VIEWER));
	const viewerError = $derived(
		selectedViewers < minViewers ? `Minimum spend is ₦${MIN_SPEND.toLocaleString()} (${minViewers} viewers)` : ''
	);

	function applyViewerPreset(val: number) {
		selectedViewers = val;
		viewerInput = val.toString();
	}

	function handleViewerInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		viewerInput = val;
		const num = parseInt(val);
		if (!isNaN(num) && num > 0) {
			selectedViewers = num;
		}
	}

	function nextStep() {
		if (step === 1 && !liveUrl) return;
		if (step === 2 && (viewerError || !viewerInput)) return;
		step = Math.min(step + 1, 3);
	}

	function prevStep() {
		step = Math.max(step - 1, 1);
	}
</script>

<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<a href="/campaigns" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
		<svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
		</svg> Back to Campaigns
	</a>
	<h1 class="text-3xl font-bold mb-2">Create Campaign</h1>
	<p class="text-muted-foreground mb-8">Set up your TikTok Live viewer acquisition campaign</p>

	<div class="flex items-center gap-2 mb-8">
		{#each [1, 2, 3] as s}
			<div class="flex items-center gap-2">
				<div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium {s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
					{s}
				</div>
				<span class="text-sm {s <= step ? 'text-foreground font-medium' : 'text-muted-foreground'} hidden sm:inline">
					{s === 1 ? 'Live URL' : s === 2 ? 'Viewers' : 'Duration'}
				</span>
				{#if s < 3}
					<div class="w-8 h-0.5 {s < step ? 'bg-primary' : 'bg-muted'}"></div>
				{/if}
			</div>
		{/each}
	</div>

	<form method="POST" use:enhance={() => { creating = true; return async ({ update }) => { creating = false; update(); }; }}>
		<input type="hidden" name="live_url" value={liveUrl} />
		<input type="hidden" name="tiktok_username" value={tiktokUsername} />
		<input type="hidden" name="viewers_requested" value={selectedViewers} />
		<input type="hidden" name="duration" value={selectedDuration} />
		<input type="hidden" name="cost" value={cost} />
		<input type="hidden" name="scheduled_at" value={scheduledAt} />

		{#if step === 1}
			<Card>
				<div class="p-6 space-y-4">
					<h2 class="text-xl font-semibold">Step 1: TikTok Username</h2>
					<p class="text-sm text-muted-foreground">Enter your TikTok username (or paste live stream URL)</p>
					<div class="relative">
						<span class="absolute left-3 top-2.5 text-muted-foreground font-medium">@</span>
						<input
							type="text"
							value={tiktokUsername}
							oninput={handleUsernameInput}
							class="flex h-10 w-full rounded-md border border-input bg-transparent pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							placeholder="username"
							required
						/>
					</div>
					{#if liveUrl}
						<div class="p-3 rounded-lg bg-muted/50 border text-xs text-muted-foreground">
							<span class="font-medium text-foreground">Target Live URL:</span>
							<span class="block mt-1 truncate font-mono">{liveUrl}</span>
						</div>
					{/if}
					<div class="flex justify-end">
						<Button type="button" onclick={nextStep} disabled={!liveUrl}>Continue</Button>
					</div>
				</div>
			</Card>
		{/if}

		{#if step === 2}
			<Card>
				<div class="p-6 space-y-4">
					<h2 class="text-xl font-semibold">Step 2: Number of Viewers</h2>
					<p class="text-sm text-muted-foreground">
						Enter desired viewers (min {minViewers} &middot; ₦{PRICE_PER_VIEWER.toLocaleString()}/viewer)
					</p>
					<input
						type="number"
						value={viewerInput}
						oninput={handleViewerInput}
						min={minViewers}
						class="flex h-12 w-full rounded-md border border-input bg-transparent px-4 py-2 text-2xl font-bold text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						placeholder="e.g. 100"
					/>
					<div class="flex flex-wrap gap-2 justify-center">
						{#each VIEWER_PRESETS as preset}
							<button
								type="button"
								onclick={() => applyViewerPreset(preset.value)}
								class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {selectedViewers === preset.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}"
							>
								{preset.label}
							</button>
						{/each}
					</div>
					{#if viewerError}
						<p class="text-sm text-destructive text-center">{viewerError}</p>
					{/if}
					<div class="p-3 rounded-lg bg-muted text-center">
						<span class="text-sm text-muted-foreground">Cost: </span>
						<span class="text-lg font-bold">₦{cost.toLocaleString()}</span>
					</div>
					<div class="flex justify-between">
						<Button type="button" variant="ghost" onclick={prevStep}>Back</Button>
						<Button type="button" onclick={nextStep} disabled={!viewerInput || !!viewerError}>Continue</Button>
					</div>
				</div>
			</Card>
		{/if}

		{#if step === 3}
			<Card>
				<div class="p-6 space-y-4">
					<h2 class="text-xl font-semibold">Step 3: Schedule & Duration</h2>

					<div class="space-y-3">
						<p class="text-sm text-muted-foreground">When is your live scheduled to start?</p>
						<div class="flex gap-3">
							<div class="flex-1">
								<label class="text-xs text-muted-foreground mb-1 block">Date</label>
								<input
									type="date"
									bind:value={scheduleDate}
									class="flex h-12 w-full rounded-xl border border-input bg-[#121216] px-4 py-3 text-base font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer [color-scheme:dark]"
								/>
							</div>
							<div class="flex-1">
								<label class="text-xs text-muted-foreground mb-1 block">Time</label>
								<input
									type="time"
									bind:value={scheduleTime}
									class="flex h-12 w-full rounded-xl border border-input bg-[#121216] px-4 py-3 text-2xl font-bold tracking-widest focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer [color-scheme:dark]"
								/>
							</div>
						</div>
					</div>

					<p class="text-sm text-muted-foreground">How long should viewers stay? <span class="text-xs">(₦{PRICE_PER_10MIN.toLocaleString()} per 10 min)</span></p>

					<!-- Quick Presets -->
					<div class="flex flex-wrap gap-2">
						{#each DURATION_PRESETS as preset}
							<button
								type="button"
								onclick={() => selectedDuration = preset.value}
								class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {selectedDuration === preset.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}"
							>
								{preset.label}
							</button>
						{/each}
					</div>

					<!-- Full Dropdown for all 10-min increments -->
					<div class="space-y-1">
						<label class="text-xs text-muted-foreground block">Or choose exact duration</label>
						<select
							bind:value={selectedDuration}
							class="flex h-12 w-full rounded-xl border border-input bg-[#121216] px-4 py-3 text-base font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer [color-scheme:dark] appearance-none"
						>
							{#each DURATION_OPTIONS as option}
								<option value={option.value}>
									{option.label} — ₦{option.cost.toLocaleString()}
								</option>
							{/each}
						</select>
					</div>

					<div class="mt-6 p-4 rounded-lg bg-muted">
						<h3 class="font-semibold mb-2">Cost Summary</h3>
						<div class="space-y-1 text-sm">
							<div class="flex justify-between">
								<span>{selectedViewers} Viewers &times; ₦{PRICE_PER_VIEWER.toLocaleString()}</span>
								<span>₦{(selectedViewers * PRICE_PER_VIEWER).toLocaleString()}</span>
							</div>
							<div class="flex justify-between">
								<span>{durationLabel} &times; ₦{PRICE_PER_10MIN.toLocaleString()}/10min</span>
								<span>₦{durationCost.toLocaleString()}</span>
							</div>
							<hr class="my-2" />
							<div class="flex justify-between font-bold text-base">
								<span>Total</span>
								<span>₦{cost.toLocaleString()}</span>
							</div>
						</div>
					</div>

					{#if form?.error}
						<p class="text-sm text-destructive">{form.error}</p>
					{/if}

					<div class="flex justify-between">
						<Button type="button" variant="ghost" onclick={prevStep}>Back</Button>
						<Button type="submit" disabled={creating}>
							{#if creating}
								<svg class="h-4 w-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
							{/if}
							{creating ? 'Creating...' : 'Create Campaign'}
						</Button>
					</div>
				</div>
			</Card>
		{/if}
	</form>
</div>
