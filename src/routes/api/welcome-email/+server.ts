import { json } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/server/welcomeEmail';

/**
 * Sends the post-signup welcome email exactly once per account.
 *
 * Email confirmation is disabled, so signUp() returns a session immediately and
 * the user lands on the dashboard. This replaces the confirmation mail with a
 * welcome mail. It is deliberately best-effort: any failure returns 200 with
 * `sent: false` so a mail problem can never block or break signup.
 */
export async function POST({ locals }) {
	if (!locals.user) return json({ sent: false, reason: 'unauthorized' }, { status: 401 });

	// Claim the send first. Updating only while welcome_email_sent_at is null
	// means two concurrent requests cannot both win, so no duplicate email.
	const { data: claimed, error: claimError } = await locals.supabase
		.from('profiles')
		.update({ welcome_email_sent_at: new Date().toISOString() })
		.eq('id', locals.user.id)
		.is('welcome_email_sent_at', null)
		.select('id, email, name')
		.maybeSingle();

	if (claimError) return json({ sent: false, reason: 'claim_failed', detail: claimError.message });
	if (!claimed) return json({ sent: false, reason: 'already_sent' });

	const result = await sendWelcomeEmail(claimed.email || locals.user.email, claimed.name);

	// Release the claim if the send failed, so it can be retried later.
	if (!result.sent) {
		await locals.supabase
			.from('profiles')
			.update({ welcome_email_sent_at: null })
			.eq('id', locals.user.id);
	}

	return json(result);
}
