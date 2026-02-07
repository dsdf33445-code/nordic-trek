// src/utils/helpers.ts
import type { CurrencyCode } from '../types'; // Change: Added 'type'

export const TRIP_START_DATE = "2026-09-18";
export const TRIP_END_DATE = "2026-10-11";

export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  TWD: 1, ISK: 0.24, EUR: 35.5, NOK: 3.1, SEK: 3.0,
};

export const formatCurrency = (amount: number, currency: CurrencyCode) => {
  return new Intl.NumberFormat('zh-TW', { 
    style: 'currency', 
    currency: currency, 
    maximumFractionDigits: 0 
  }).format(amount);
};