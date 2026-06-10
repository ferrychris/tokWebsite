export interface Profile {
	id: string;
	email: string;
	role: 'creator' | 'admin' | 'tasker';
	name: string;
	tiktok_username?: string;
	created_at: string;
}

export interface Wallet {
	id: string;
	user_id: string;
	balance: number;
	bonus_balance: number;
	created_at: string;
}

export interface Campaign {
	id: string;
	user_id: string;
	live_url: string;
	viewers_requested: number;
	duration: number;
	cost: number;
	status: 'draft' | 'pending' | 'scheduled' | 'active' | 'completed' | 'cancelled';
	viewers_delivered?: number;
	scheduled_at?: string | null;
	created_at: string;
}

export interface Transaction {
	id: string;
	user_id: string;
	amount: number;
	type: 'deposit' | 'withdrawal' | 'campaign_spend' | 'bonus';
	reference?: string;
	status: 'pending' | 'completed' | 'failed';
	created_at: string;
}

export interface CampaignAssignment {
	id: string;
	campaign_id: string;
	worker_id: string;
	status: 'pending' | 'joined' | 'completed';
	joined_at?: string;
	completed_at?: string;
}

export interface PlatformStats {
  id: number;
  streams_hosted: number;
  average_growth: number;
  paid_to_creators: number;
}

export interface Notification {
	id: string;
	user_id: string;
	type: 'new_task' | 'campaign_update' | 'payment' | 'system';
	title: string;
	body: string;
	data?: Record<string, any>;
	read: boolean;
	created_at: string;
}

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: Profile;
				Insert: Omit<Profile, 'created_at'>;
				Update: Partial<Omit<Profile, 'id'>>;
			};
			wallets: {
				Row: Wallet;
				Insert: Omit<Wallet, 'created_at'>;
				Update: Partial<Omit<Wallet, 'id' | 'user_id'>>;
			};
			campaigns: {
				Row: Campaign;
				Insert: Omit<Campaign, 'created_at'>;
				Update: Partial<Omit<Campaign, 'id' | 'user_id'>>;
			};
			transactions: {
				Row: Transaction;
				Insert: Omit<Transaction, 'created_at'>;
				Update: Partial<Omit<Transaction, 'id'>>;
			};
			campaign_assignments: {
				Row: CampaignAssignment;
				Insert: Omit<CampaignAssignment, 'id'>;
				Update: Partial<Omit<CampaignAssignment, 'id'>>;
			};
			platform_stats: {
				Row: PlatformStats;
				Insert: Omit<PlatformStats, 'id'>;
				Update: Partial<Omit<PlatformStats, 'id'>>;
			};
			notifications: {
				Row: Notification;
				Insert: Omit<Notification, 'id' | 'created_at'>;
				Update: Partial<Pick<Notification, 'read'>>;
			};
		};
	};
}
