import { CurrencyRate } from '../types/bank';

export const CURRENCY_RATES: Record<string, CurrencyRate> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateAgainstUSD: 1.0 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateAgainstUSD: 0.0115 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateAgainstUSD: 0.0106 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateAgainstUSD: 0.0091 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateAgainstUSD: 0.0154 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rateAgainstUSD: 0.0422 },
};
