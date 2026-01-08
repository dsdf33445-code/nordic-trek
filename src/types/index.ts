// src/types/index.ts

// [新增] 在這裡加入 'train' 和 'ship'
export type CategoryType = 'flight' | 'stay' | 'activity' | 'food' | 'transport' | 'shopping' | 'other' | 'car' | 'train' | 'ship';
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
  // [新增] 加入 'train' 和 'ship' 讓 TypeScript 允許這些類型
  type: 'flight' | 'stay' | 'car' | 'transport' | 'activity' | 'train' | 'ship';
  title: string;
  subtitle: string;
  date: string;
  details: { label: string; value: string; }[];
  refNumber: string;
  status: 'confirmed' | 'pending';
  link?: string;  
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