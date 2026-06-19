import { error, fail, redirect } from '@sveltejs/kit';
import { MIN_SPEND, PRICE_PER_VIEWER, BONUS_FIRST_CAMPAIGN_VIEWERS } from '$lib/utils/constants';

export async function load({ params, locals }: { params: { id: string }; locals: App.Locals }) {
	if (!locals.user) throw redirect(303, '/login');

	const { data: campaign } = await locals.supabase
		.from('campaigns')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!campaign) throw error(404, 'Campaign not found');
	if (campaign.user_id !== locals.user.id && locals.profile?.role !== 'admin') {
		throw error(403, 'Forbidden');
	}

	const { data: wallet } = await locals.supabase
		.from('wallets')
		.select('*')
		.eq('user_id', locals.user.id)
		.maybeSingle();

	return { campaign, wallet };
}

export const actions = {
	activate: async ({ params, locals }: { params: { id: string }; locals: App.Locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const { data: campaign } = await locals.supabase
			.from('campaigns')
			.select('*')
			.eq('id', params.id)
			.single();

		if (!campaign) return fail(404, { error: 'Campaign not found' });
		if (campaign.user_id !== locals.user.id) return fail(403, { error: 'Forbidden' });
		if (campaign.status !== 'draft' && campaign.status !== 'pending') {
			return fail(400, { error: 'Campaign cannot be activated' });
		}

		let { data: wallet } = await locals.supabase
			.from('wallets')
			.select('*')
			.eq('user_id', locals.user.id)
			.maybeSingle();

		if (!wallet) {
			const { data: newWallet } = await locals.supabase
				.from('wallets')
				.insert({ user_id: locals.user.id, balance: 0, bonus_balance: 0 })
				.select()
				.single();
			wallet = newWallet;
		}

		const totalBalance = (wallet?.balance || 0) + (wallet?.bonus_balance || 0);
		if (totalBalance < campaign.cost) {
			return fail(400, { error: `Insufficient balance. Need ₦${campaign.cost.toLocaleString()}, have ₦${totalBalance.toLocaleString()}. Please fund your wallet.` });
		}

		let deduction = campaign.cost;
		let bonusUsed = 0;

		if ((wallet?.bonus_balance || 0) >= deduction) {
			bonusUsed = deduction;
			deduction = 0;
		} else if ((wallet?.bonus_balance || 0) > 0) {
			bonusUsed = wallet.bonus_balance;
			deduction -= wallet.bonus_balance;
		}

		await locals.supabase
			.from('wallets')
			.update({
				balance: (wallet?.balance || 0) - deduction,
				bonus_balance: (wallet?.bonus_balance || 0) - bonusUsed
			})
			.eq('user_id', locals.user.id);

		await locals.supabase.from('transactions').insert({
			user_id: locals.user.id,
			amount: campaign.cost,
			type: 'campaign_spend',
			reference: `CAMP-${campaign.id}-${Date.now()}`,
			status: 'completed'
		});

		await locals.supabase
			.from('campaigns')
			.update({ status: 'active' })
			.eq('id', campaign.id);

		await locals.supabase.from('notifications').insert({
			user_id: locals.user.id,
			type: 'campaign_update',
			title: 'Campaign Activated',
			body: `Campaign for ${campaign.viewers_requested} viewers is now live.`,
			data: { campaign_id: campaign.id }
		});

		return { success: true, action: 'activate' };
	},

	cancel: async ({ params, locals }: { params: { id: string }; locals: App.Locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const { data: campaign } = await locals.supabase
			.from('campaigns')
			.select('*')
			.eq('id', params.id)
			.single();

		if (!campaign) return fail(404, { error: 'Campaign not found' });
		if (campaign.user_id !== locals.user.id) return fail(403, { error: 'Forbidden' });
		if (campaign.status === 'completed' || campaign.status === 'cancelled') {
			return fail(400, { error: 'Campaign already ended' });
		}

		let refunded = false;

		// Active campaigns were already charged — refund the cost back to wallet
		if (campaign.status === 'active') {
			const { data: wallet } = await locals.supabase
				.from('wallets')
				.select('*')
				.eq('user_id', locals.user.id)
				.maybeSingle();

			if (wallet) {
				await locals.supabase
					.from('wallets')
					.update({ balance: wallet.balance + campaign.cost })
					.eq('user_id', locals.user.id);

				await locals.supabase.from('transactions').insert({
					user_id: locals.user.id,
					amount: campaign.cost,
					type: 'deposit',
					reference: `REFUND-${campaign.id}-${Date.now()}`,
					status: 'completed'
				});

				refunded = true;
			}
		}

		await locals.supabase
			.from('campaigns')
			.update({ status: 'cancelled' })
			.eq('id', campaign.id);

		await locals.supabase.from('notifications').insert({
			user_id: locals.user.id,
			type: 'campaign_update',
			title: 'Campaign Cancelled',
			body: refunded
				? `Campaign cancelled. ₦${campaign.cost.toLocaleString()} has been refunded to your wallet.`
				: `Campaign has been cancelled.`,
			data: { campaign_id: campaign.id }
		});

		return { success: true, action: 'cancel', refunded, refundAmount: campaign.cost };
	}
};
