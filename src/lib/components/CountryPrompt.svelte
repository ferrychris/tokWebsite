<script lang="ts">
	import { createClient } from '$lib/supabase/client';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { COUNTRIES } from '$lib/utils/countries';

	let { userId, country = null }: { userId: string | undefined; country?: string | null } = $props();

	const DISMISS_KEY = 'country-prompt-dismissed';

	let selected = $state('');
	let saving = $state(false);
	let error = $state('');
	let dismissed = $state(true); // assume hidden until we've checked localStorage

	onMount(() => {
		dismissed = localStorage.getItem(DISMISS_KEY) === '1';
	});

	// Only ask when we genuinely don't know where they are.
	const visible = $derived(!!userId && !country && !dismissed);

	function dismiss() {
		dismissed = true;
		localStorage.setItem(DISMISS_KEY, '1');
	}

	async function save() {
		if (!selected || !userId) return;
		saving = true;
		error = '';
		try {
			const supabase = createClient();
			const { error: updateError } = await supabase
				.from('profiles')
				.update({ country: selected })
				.eq('id', userId);
			if (updateError) throw updateError;
			localStorage.removeItem(DISMISS_KEY);
			await invalidateAll();
		} catch (e: any) {
			error = e.message || 'Could not save your country';
		} finally {
			saving = false;
		}
	}
</script>

{#if visible}
	<div class="rounded-2xl border border-[#232326] bg-[#131316]/60 backdrop-blur-md p-5 flex flex-col lg:flex-row lg:items-center gap-4">
		<div class="w-10 h-10 rounded-xl bg-[#FF2A54]/10 flex items-center justify-center text-[#FF2A54] shrink-0">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18" />
			</svg>
		</div>

		<div class="flex-1 min-w-0">
			<h3 class="font-semibold text-white text-sm">Set your country</h3>
			<p class="text-sm text-gray-400 mt-0.5">
				Prices are showing in US Dollars. Tell us where you are to see them in your local currency.
			</p>
			{#if error}
				<p class="text-sm text-destructive mt-2">{error}</p>
			{/if}
		</div>

		<div class="flex items-center gap-2 shrink-0">
			<label for="country-prompt" class="sr-only">Country</label>
			<select
				id="country-prompt"
				bind:value={selected}
				class="h-9 rounded-lg border border-[#232326] bg-[#16161C] px-3 text-sm text-white focus:outline-none focus:border-[#FF2A54]/50 transition-colors [color-scheme:dark]"
			>
				<option value="" disabled>Select country</option>
				{#each COUNTRIES as c}
					<option value={c.code}>{c.name}</option>
				{/each}
			</select>
			<Button
				onclick={save}
				disabled={!selected || saving}
				class="bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 font-medium px-4"
			>
				{saving ? 'Saving…' : 'Save'}
			</Button>
			<button
				type="button"
				onclick={dismiss}
				aria-label="Dismiss"
				class="p-2 text-gray-500 hover:text-gray-300 transition-colors"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	</div>
{/if}
