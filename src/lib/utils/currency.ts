// All amounts are stored and charged in Naira (NGN) — Flutterwave, the only
// wired-up payment processor, only settles in NGN. For non-Nigerian users we
// convert NGN amounts to USD for display purposes only, using a fixed rate.
export const NGN_PER_USD = 1600;

// Dollars are the default. Naira is used only when we positively know the user
// is in Nigeria — an unknown/unset country falls through to USD.
export function isNigeria(country?: string | null): boolean {
	if (!country) return false;
	const c = country.trim().toLowerCase();
	return c === 'ng' || c === 'nigeria';
}

export function currencySymbol(country?: string | null): string {
	return isNigeria(country) ? '₦' : '$';
}

export type CurrencyCode = 'NGN' | 'USD';

/** Which currency a country defaults to, before any manual override. */
export function defaultCurrency(country?: string | null): CurrencyCode {
	return isNigeria(country) ? 'NGN' : 'USD';
}

/** Convert a stored Naira amount into the display currency's units. */
export function toDisplayAmount(amountNgn: number, currency: CurrencyCode): number {
	return currency === 'NGN' ? amountNgn : amountNgn / NGN_PER_USD;
}

/** Format an explicit currency, ignoring country. Use when the user has toggled. */
export function formatIn(amountNgn: number, currency: CurrencyCode): string {
	if (currency === 'NGN') return `₦${Math.round(amountNgn).toLocaleString()}`;
	const usd = amountNgn / NGN_PER_USD;
	return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCurrency(amountNgn: number, country?: string | null): string {
	if (isNigeria(country)) {
		return `₦${Math.round(amountNgn).toLocaleString()}`;
	}
	const usd = amountNgn / NGN_PER_USD;
	return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
