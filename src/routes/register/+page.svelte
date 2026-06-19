<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Separator from '$lib/components/ui/separator.svelte';
	import { createClient } from '$lib/supabase/client';
	import { loadSession } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let tiktokUsername = $state('');
	let error = $state('');
	let success = $state('');
	let loading = $state(false);

	const supabase = createClient();

	async function handleRegister() {
		error = '';
		success = '';
		loading = true;
		try {
			const { data, error: authError } = await supabase.auth.signUp({
				email,
				password,
				options: { data: { name, tiktok_username: tiktokUsername } }
			});
			if (authError) throw authError;
			if (data.user) {
				const { error: profileError } = await supabase.from('profiles').insert({
					id: data.user.id,
					email,
					name,
					role: 'creator',
					tiktok_username: tiktokUsername || undefined
				});
				if (profileError) throw profileError;

				const { error: walletError } = await supabase.from('wallets').insert({
					user_id: data.user.id,
					balance: 0,
					bonus_balance: 0
				});
				if (walletError) throw walletError;

				const { data: { session } } = await supabase.auth.getSession();
				if (session) {
					await loadSession();
					goto('/dashboard');
				} else {
					success = 'Registration successful! Please check your email to confirm your account.';
				}
			}
		} catch (e: any) {
			error = e.message || 'Failed to create account';
		} finally {
			loading = false;
		}
	}

	async function handleGoogle() {
		error = '';
		try {
			const { error: authError } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: { redirectTo: `${location.origin}/auth/callback` }
			});
			if (authError) throw authError;
		} catch (e: any) {
			error = e.message || 'Failed to sign up with Google';
		}
	}
</script>

<svelte:head>
	<title>Sign Up — Soyomu Live | Drive Traffic to Your TikTok Livestream</title>
	<meta name="description" content="Create your free Soyomu Live account and launch viewer acquisition campaigns to drive traffic to your livestream. Sign up in seconds." />
	<meta property="og:title" content="Sign Up — Soyomu Live | Drive Traffic to Your TikTok Livestream" />
	<meta property="og:description" content="Create your free Soyomu Live account and launch viewer acquisition campaigns to drive traffic to your livestream." />
</svelte:head>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-[#0A0A0C] text-white py-12 relative overflow-hidden">
	<!-- Ambient Background Glows -->
	<div class="absolute top-1/4 left-1/4 w-80 h-80 bg-[#FF2A54]/5 rounded-full filter blur-[100px] pointer-events-none"></div>
	<div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

	<div class="w-full max-w-md bg-[#131316]/55 border border-[#232326] rounded-2xl p-8 backdrop-blur-md shadow-2xl relative z-10 space-y-6">
		<!-- Brand & Header -->
		<div class="text-center space-y-3">
			<div class="flex items-center justify-center gap-2.5 mb-2">
				<div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1E1E24] to-[#2D2D35] flex items-center justify-center border border-[#3D3D45]">
					<svg class="h-4.5 w-4.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M30 20C45 20 55 35 55 50C55 65 45 80 30 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
						<path d="M70 20C55 20 45 35 45 50C45 65 55 80 70 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
					</svg>
				</div>
				<span class="text-white font-extrabold text-lg">Soyomu Live</span>
			</div>
			<h1 class="text-2xl font-bold tracking-tight text-white">Create your account</h1>
			<p class="text-sm text-gray-400">Launch viewer acquisition campaigns today</p>
		</div>

		<!-- Google Signup -->
		<Button onclick={handleGoogle} class="w-full bg-[#1C1C22] hover:bg-[#27272E] text-white border border-[#2D2D35] rounded-xl flex items-center justify-center gap-3 py-5.5 text-sm transition-colors">
			<svg class="h-4.5 w-4.5" viewBox="0 0 24 24">
				<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
				<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
				<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
				<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
			</svg>
			Continue with Google
		</Button>

		<div class="flex items-center gap-3">
			<Separator class="flex-1 bg-[#232326]" />
			<span class="text-xs text-gray-500 font-bold uppercase tracking-wider">or</span>
			<Separator class="flex-1 bg-[#232326]" />
		</div>

		<!-- Form -->
		<form onsubmit={(e) => { e.preventDefault(); handleRegister(); }} class="space-y-4">
			<div class="space-y-1">
				<label for="name" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					class="flex h-11 w-full rounded-xl border border-[#232326] bg-[#16161C] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF2A54]/50 transition-colors"
					required
					placeholder="John Doe"
				/>
			</div>

			<div class="space-y-1">
				<label for="email" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					class="flex h-11 w-full rounded-xl border border-[#232326] bg-[#16161C] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF2A54]/50 transition-colors"
					required
					placeholder="you@example.com"
				/>
			</div>

			<div class="space-y-1">
				<label for="password" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="flex h-11 w-full rounded-xl border border-[#232326] bg-[#16161C] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF2A54]/50 transition-colors"
					required
					placeholder="Min. 6 characters"
					minlength={6}
				/>
			</div>

			<div class="space-y-1">
				<label for="tiktok" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">TikTok Username <span class="text-gray-500 font-medium lowercase">(optional)</span></label>
				<input
					id="tiktok"
					type="text"
					bind:value={tiktokUsername}
					class="flex h-11 w-full rounded-xl border border-[#232326] bg-[#16161C] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF2A54]/50 transition-colors"
					placeholder="username"
				/>
			</div>

			{#if error}
				<p class="text-sm text-red-400 font-medium">{error}</p>
			{/if}
			{#if success}
				<p class="text-sm text-emerald-400 font-medium">{success}</p>
			{/if}

			<Button type="submit" class="w-full bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 py-5.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#FF2A54]/10" disabled={loading}>
				{loading ? 'Creating account...' : 'Create Account'}
			</Button>
		</form>

		<!-- Signin link -->
		<p class="text-center text-sm text-gray-400">
			Already have an account? <a href="/login" class="text-[#FF2A54] hover:underline font-semibold">Sign in</a>
		</p>
	</div>
</div>
