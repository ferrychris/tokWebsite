<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { BONUS_FIRST_DEPOSIT_PERCENT, BONUS_FIRST_DEPOSIT_MINIMUM } from '$lib/utils/constants';
	import { PUBLIC_FLUTTERWAVE_PUBLIC_KEY } from '$env/static/public';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let { data } = $props();
	let wallet = $state(data.wallet);
	let transactions = $state(data.transactions || []);
	let depositAmount = $state('');
	let depositError = $state('');
	let showDepositForm = $state(false);
	let processing = $state(false);
	let flutterwaveLoaded = $state(false);

	$effect(() => {
		wallet = data.wallet;
		transactions = data.transactions || [];
	});

	onMount(() => {
		if (typeof window !== 'undefined' && !document.querySelector('script[src*="flutterwave"]')) {
			const script = document.createElement('script');
			script.src = 'https://checkout.flutterwave.com/v3.js';
			script.async = true;
			script.onload = () => flutterwaveLoaded = true;
			document.body.appendChild(script);
		} else {
			flutterwaveLoaded = true;
		}
	});

	const formatCurrency = (n: number) => `\u20A6${n.toLocaleString()}`;

	const typeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
		deposit: 'default', withdrawal: 'destructive',
		campaign_spend: 'secondary', bonus: 'secondary'
	};

	async function handleDeposit() {
		depositError = '';
		const amount = parseInt(depositAmount);
		if (!amount || amount < 100) { depositError = 'Minimum deposit is ₦100'; return; }

		if (!flutterwaveLoaded) { depositError = 'Payment gateway loading, please wait...'; return; }

		processing = true;
		try {
			const initRes = await fetch('/api/flutterwave/initialize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ amount })
			});
			const initData = await initRes.json();
			if (!initRes.ok) throw new Error(initData.error);

			const customerEmail = data.user?.email || '';

			((window as any).FlutterwaveCheckout)({
				public_key: PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
				tx_ref: initData.tx_ref,
				amount: initData.amount,
				currency: 'NGN',
				customer: { email: customerEmail },
				callback: async (response: any) => {
					if (response.status === 'successful' || response.status === 'completed') {
						try {
							const verifyRes = await fetch('/api/flutterwave/verify', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ tx_ref: initData.tx_ref, transaction_id: response.transaction_id })
							});
							const verifyData = await verifyRes.json();
							if (verifyRes.ok && verifyData.success) {
								toast.success('Deposit successful', {
									description: verifyData.bonusAmount > 0
										? `₦${verifyData.amount.toLocaleString()} deposited + ₦${verifyData.bonusAmount.toLocaleString()} bonus!`
										: `₦${verifyData.amount.toLocaleString()} deposited`
								});
								depositAmount = '';
								showDepositForm = false;
								invalidateAll();
							} else {
								toast.error('Verification failed', { description: verifyData.error || 'Please contact support' });
							}
						} catch {
							toast.error('Verification failed', { description: 'Could not verify payment. Contact support with ref: ' + initData.tx_ref });
						}
					} else {
						toast.error('Payment was not completed');
					}
				},
				onclose: () => {
					processing = false;
				}
			});
		} catch (e: any) {
			depositError = e.message || 'Failed to initialize payment';
			processing = false;
		}
	}
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-3xl font-bold mb-8">Wallet</h1>

	<div class="grid sm:grid-cols-3 gap-4 mb-8">
		<Card>
			<div class="p-6">
				<p class="text-sm text-muted-foreground flex items-center gap-2">
					<svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
					</svg> Main Balance
				</p>
				<p class="text-3xl font-bold mt-2">{formatCurrency(wallet?.balance || 0)}</p>
			</div>
		</Card>
		<Card>
			<div class="p-6">
				<p class="text-sm text-muted-foreground flex items-center gap-2">
					<svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25A1.5 1.5 0 0 1 3 19.5v-8.25M12 4.5v16.5m-9-9h18M18 5.25a2.25 2.25 0 0 0-2.25-2.25H12v4.5h3.75A2.25 2.25 0 0 0 18 5.25ZM12 3a2.25 2.25 0 0 0-2.25 2.25V7.5H12V3Z" />
					</svg> Bonus Balance
				</p>
				<p class="text-3xl font-bold mt-2">{formatCurrency(wallet?.bonus_balance || 0)}</p>
			</div>
		</Card>
		<Card>
			<div class="p-6">
				<p class="text-sm text-muted-foreground flex items-center gap-2">
					<svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.107c.19.074.396-.03.47-.228L21.75 12M2.25 18.75a60.07 60.07 0 0 0 15.797-2.107c.19-.074.396.03.47.228L21.75 12M2.25 18.75V8.25A2.25 2.25 0 0 1 4.5 6h9.75A2.25 2.25 0 0 1 16.5 8.25v10.5m-10.5-6L21.75 12m-13.5-3.75h.008v.008H8.25V8.25Zm.008 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Z" />
					</svg> Total Balance
				</p>
				<p class="text-3xl font-bold mt-2">{formatCurrency((wallet?.balance || 0) + (wallet?.bonus_balance || 0))}</p>
			</div>
		</Card>
	</div>

	<div class="mb-8">
		{#if showDepositForm}
			<Card>
				<div class="p-6 space-y-4">
					<h3 class="font-semibold">Deposit Funds</h3>
					<p class="text-sm text-muted-foreground">Enter the amount you want to deposit (NGN)</p>
					<input
						type="number"
						bind:value={depositAmount}
						class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-lg font-bold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						placeholder="₦10,000"
						min="100"
					/>
					{#if depositError}
						<p class="text-sm text-destructive">{depositError}</p>
					{/if}
					<div class="flex gap-3">
						<Button onclick={handleDeposit} disabled={processing || !depositAmount || !flutterwaveLoaded}>
							{#if processing}
								<svg class="h-4 w-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
							{/if}
							{processing ? 'Processing...' : `Deposit ${depositAmount ? formatCurrency(parseInt(depositAmount)) : ''}`}
						</Button>
						<Button variant="ghost" onclick={() => { showDepositForm = false; depositError = ''; }}>Cancel</Button>
					</div>
					<p class="text-xs text-muted-foreground">
						First deposit of ₦10,000 or more gets 10% bonus credit!
					</p>
				</div>
			</Card>
		{:else}
			<Button onclick={() => showDepositForm = true}>
				<svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg> Deposit Funds
			</Button>
		{/if}
	</div>

	<Card>
		<div class="p-6">
			<h3 class="font-semibold mb-4">Transaction History</h3>
			{#if transactions.length === 0}
				<p class="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
			{:else}
				<div class="space-y-3">
					{#each transactions as tx}
						<div class="flex items-center justify-between p-3 rounded-lg border">
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
									{#if tx.type === 'deposit'}
										<svg class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 4.5 9 15M9 15h9M9 15V6" />
										</svg>
									{:else if tx.type === 'withdrawal'}
										<svg class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5 15 9m0 0H6m9 0v9" />
										</svg>
									{:else if tx.type === 'campaign_spend'}
										<svg class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
										</svg>
									{:else if tx.type === 'bonus'}
										<svg class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25A1.5 1.5 0 0 1 3 19.5v-8.25M12 4.5v16.5m-9-9h18M18 5.25a2.25 2.25 0 0 0-2.25-2.25H12v4.5h3.75A2.25 2.25 0 0 0 18 5.25ZM12 3a2.25 2.25 0 0 0-2.25 2.25V7.5H12V3Z" />
										</svg>
									{:else}
										<svg class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
										</svg>
									{/if}
								</div>
								<div>
									<p class="text-sm font-medium capitalize">{tx.type.replace('_', ' ')}</p>
									<p class="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
								</div>
							</div>
							<div class="text-right">
								<p class="text-sm font-bold {tx.type === 'withdrawal' || tx.type === 'campaign_spend' ? 'text-destructive' : 'text-emerald-400'}">
									{tx.type === 'withdrawal' || tx.type === 'campaign_spend' ? '-' : '+'}{formatCurrency(tx.amount)}
								</p>
								<Badge variant={tx.status === 'completed' ? 'default' : 'outline'} class="text-xs">{tx.status}</Badge>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</Card>
</div>
