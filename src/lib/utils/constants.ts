export const MIN_SPEND = 1000;
export const PRICE_PER_VIEWER = 100;

export const VIEWER_PRESETS = [
	{ label: '10', value: 10 },
	{ label: '100', value: 100 },
	{ label: '250', value: 250 },
	{ label: '500', value: 500 }
] as const;

export const MAX_DURATION = 180;

export const DURATION_OPTIONS = Array.from({ length: MAX_DURATION / 10 }, (_, i) => {
	const mins = (i + 1) * 10;
	const hrs = Math.floor(mins / 60);
	const rem = mins % 60;
	const label = hrs > 0
		? rem > 0 ? `${hrs}hr ${rem}min` : `${hrs}hr`
		: `${mins}min`;
	return { label, value: mins, slots: mins / 10 };
});

export const DURATION_PRESETS = [
	{ label: '10min', value: 10 },
	{ label: '30min', value: 30 },
	{ label: '1hr', value: 60 },
	{ label: '1hr 30min', value: 90 },
	{ label: '2hr', value: 120 },
	{ label: '3hr', value: 180 }
] as const;


export const CAMPAIGN_STATUS = {
	DRAFT: 'draft',
	PENDING: 'pending',
	SCHEDULED: 'scheduled',
	ACTIVE: 'active',
	COMPLETED: 'completed',
	CANCELLED: 'cancelled'
} as const;

export const TRANSACTION_TYPE = {
	DEPOSIT: 'deposit',
	WITHDRAWAL: 'withdrawal',
	CAMPAIGN_SPEND: 'campaign_spend',
	BONUS: 'bonus'
} as const;

export const BONUS_FIRST_CAMPAIGN_VIEWERS = 10;
export const BONUS_FIRST_DEPOSIT_PERCENT = 10;
export const BONUS_FIRST_DEPOSIT_MINIMUM = 10000;

export const APP_NAME = 'TikTokLive Engage';
export const APP_DESCRIPTION = 'Get real people watching your TikTok Live';
