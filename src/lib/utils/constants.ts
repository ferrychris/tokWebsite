export const MIN_SPEND = 1000;
export const PRICE_PER_VIEWER = 100;

export const VIEWER_PRESETS = [
	{ label: '10', value: 10 },
	{ label: '100', value: 100 },
	{ label: '250', value: 250 },
	{ label: '500', value: 500 }
] as const;

export const DURATION_OPTIONS = [
	{ label: '10 minutes', value: 10 },
	{ label: '20 minutes', value: 20 },
	{ label: '30 minutes', value: 30 }
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
