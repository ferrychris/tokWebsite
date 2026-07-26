import { env } from '$env/dynamic/private';

export type WelcomeResult =
	| { sent: true }
	| { sent: false; reason: 'not_configured' | 'already_sent' | 'send_failed'; detail?: string };

/**
 * The key is read from RESEND_API_KEY, falling back to the legacy
 * VITE_RESEND_API_KEY name. Note that `VITE_`-prefixed variables are exposed to
 * the browser by Vite if they are ever read through `import.meta.env` — this is
 * only safe because it is read here, server-side, via $env/dynamic/private.
 * Renaming it to RESEND_API_KEY removes that footgun entirely.
 */
function resendKey(): string | null {
	return env.RESEND_API_KEY || env.VITE_RESEND_API_KEY || null;
}

/** Sender must be on a domain verified in the Resend account, or Resend 403s. */
function sender(): string {
	return env.RESEND_FROM || 'Tikweb <onboarding@resend.dev>';
}

export async function sendWelcomeEmail(to: string, name?: string | null): Promise<WelcomeResult> {
	const key = resendKey();
	if (!key || !to) return { sent: false, reason: 'not_configured' };

	const greeting = name?.trim() ? name.trim().split(' ')[0] : 'there';

	const html = `
<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
	<h1 style="font-size:22px;margin:0 0 16px">Welcome to Tikweb, ${escapeHtml(greeting)} 👋</h1>
	<p style="line-height:1.6;margin:0 0 14px">
		Your account is ready. Tikweb helps you drive real viewers to your TikTok livestreams —
		launch a campaign, set your budget, and watch your audience grow.
	</p>
	<p style="line-height:1.6;margin:0 0 22px">Here's how to get started:</p>
	<ol style="line-height:1.8;margin:0 0 24px;padding-left:20px">
		<li>Connect your TikTok livestream URL</li>
		<li>Fund your wallet</li>
		<li>Launch your first campaign</li>
	</ol>
	<a href="https://tikweb.online/dashboard"
		 style="display:inline-block;background:#FF2A54;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:10px">
		Go to your dashboard
	</a>
	<p style="line-height:1.6;margin:26px 0 0;color:#666;font-size:13px">
		Didn't create this account? You can safely ignore this email.
	</p>
</div>`.trim();

	try {
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				from: sender(),
				to: [to],
				subject: 'Welcome to Tikweb 🎉',
				html
			})
		});

		if (!res.ok) {
			const detail = (await res.text()).slice(0, 300);
			return { sent: false, reason: 'send_failed', detail: `${res.status} ${detail}` };
		}
		return { sent: true };
	} catch (e: any) {
		return { sent: false, reason: 'send_failed', detail: e?.message };
	}
}

function escapeHtml(s: string): string {
	return s.replace(/[&<>"']/g, (c) =>
		({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
	);
}
