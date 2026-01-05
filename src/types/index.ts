// src/types/index.ts

export type CategoryType = 'flight' | 'stay' | 'activity' | 'food' | 'transport' | 'shopping' | 'other' | 'car';
export type CurrencyCode = 'TWD' | 'ISK' | 'EUR' | 'NOK' | 'SEK';

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  location?: string;
  category: CategoryType;
  note?: string;
}

export interface DaySchedule {
  date: string;
  weather?: 'sunny' | 'rainy' | 'snowy' | 'cloudy';
  temp?: string;
  items: ItineraryItem[];
}

export interface Booking {
  id: string;
  type: 'flight' | 'stay' | 'car' | 'transport';
  title: string;
  subtitle: string;
  date: string;
  details: { label: string; value: string; }[];
  refNumber: string;
  status: 'confirmed' | 'pending';
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  category: CategoryType;
  date: string;
  payer: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
}

export interface JournalPost {
  id: string;
  content: string;
  date: string;
  location: string;
  imageColor: string;
  author: string;
  likes: number;
}