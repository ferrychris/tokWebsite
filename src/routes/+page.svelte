<script lang="ts">
	import Hero from '$lib/components/landing/Hero.svelte';
	import TrustedBy from '$lib/components/landing/TrustedBy.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import Pricing from '$lib/components/landing/Pricing.svelte';
	import Testimonials from '$lib/components/landing/Testimonials.svelte';
	import FooterCta from '$lib/components/landing/FooterCta.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import ActivityFeed from '$lib/components/landing/ActivityFeed.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Tikweb — Drive Traffic to Your TikTok Livestream</title>
	<meta name="description" content="Drive traffic to your TikTok livestream. Launch viewer acquisition campaigns, connect with genuine audiences, and measure watch time and livestream performance metrics." />
	<meta property="og:title" content="Tikweb — Drive Traffic to Your TikTok Livestream" />
	<meta property="og:description" content="Drive traffic to your TikTok livestream. Launch viewer acquisition campaigns, connect with genuine audiences, and measure watch time." />
</svelte:head>

<Hero {data} />
<TrustedBy />
<HowItWorks />
<Features />
<Pricing country={data.profile?.country} />
<Testimonials />
<FooterCta />
<Footer />
<ActivityFeed />

