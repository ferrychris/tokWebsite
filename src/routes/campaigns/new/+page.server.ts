import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }: { request: Request; locals: App.Locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const form = await request.formData();
		const live_url = form.get('live_url') as string;
		const tiktok_username = form.get('tiktok_username') as string;
		const viewers_requested = parseInt(form.get('viewers_requested') as string);
		const duration = parseInt(form.get('duration') as string);
		const cost = parseInt(form.get('cost') as string);
		const scheduled_at = form.get('scheduled_at') as string | null;

		if (!live_url) return fail(400, { error: 'TikTok Live URL is required' });
		if (!viewers_requested || viewers_requested < 10) return fail(400, { error: 'Minimum 10 viewers (₦1,000 minimum spend)' });
		if (!duration || duration < 10 || duration > 180 || duration % 10 !== 0) return fail(400, { error: 'Duration must be 10–180 minutes in 10-minute increments' });

		if (tiktok_username) {
			const cleanUsername = tiktok_username.trim().replace(/^@/, '');
			if (cleanUsername && cleanUsername !== locals.profile?.tiktok_username) {
				await locals.supabase
					.from('profiles')
					.update({ tiktok_username: cleanUsername })
					.eq('id', locals.user.id);
			}
		}

		const { data: campaign, error } = await locals.supabase
			.from('campaigns')
			.insert({
				user_id: locals.user.id,
				live_url,
				viewers_requested,
				duration,
				cost,
				scheduled_at: scheduled_at ? new Date(scheduled_at).toISOString() : null,
				status: 'draft'
			})
			.select()
			.single();

		if (error) return fail(500, { error: error.message });

		await locals.supabase.from('notifications').insert({
			user_id: locals.user.id,
			type: 'campaign_update',
			title: 'Campaign Created',
			body: `Campaign for ${viewers_requested} viewers created — fund your wallet and activate to get started.`,
			data: { campaign_id: campaign.id }
		});

		throw redirect(303, `/campaigns/${campaign.id}`);
	}
};
