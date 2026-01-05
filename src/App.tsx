import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlane, faHotel, faMapMarkerAlt, faUtensils, faCar, 
  faCheckCircle, faWallet, faBookOpen, faSuitcase, faUserFriends,
  faCloudSun, faCloudRain, faSnowflake, faClock, faCamera,
  faBed, faUnlock, faLock, faEye, faEyeSlash, faPassport,
  faPlus, faTimes, faReceipt, faShoppingBag, faTicketAlt, faBackspace, faPaperPlane, faImage, faHeart, faShip, faTrain, faBus
} from '@fortawesome/free-solid-svg-icons';
import { format, differenceInDays, addDays, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';

// --- 1. Types & Interfaces ---
type CategoryType = 'flight' | 'stay' | 'activity' | 'food' | 'transport' | 'shopping' | 'other';
type CurrencyCode = 'TWD' | 'ISK' | 'EUR' | 'NOK' | 'SEK';

interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  location?: string;
  category: CategoryType;
  note?: string;
}

interface DaySchedule {
  date: string;
  weather?: 'sunny' | 'rainy' | 'snowy' | 'cloudy';
  temp?: string;
  items: ItineraryItem[];
}

interface Booking {
  id: string;
  type: 'flight' | 'stay' | 'car';
  title: string;
  subtitle: string;
  date: string;
  details: { label: string; value: string; }[];
  refNumber: string;
  status: 'confirmed' | 'pending';
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  category: CategoryType;
  date: string;
  payer: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
}

interface JournalPost {
  id: string;
  content: string;
  date: string;
  location: string;
  imageColor: string;
  author: string;
  likes: number;
}

// --- 2. Constants & Helpers ---
const TRIP_START_DATE = "2026-09-18";
const TRIP_END_DATE = "2026-10-11";
const PIN_CODE = "0829";

const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  TWD: 1, ISK: 0.24, EUR: 35.5, NOK: 3.1, SEK: 3.0,
};

const formatCurrency = (amount: number, currency: CurrencyCode) => {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount);
};

// --- 3. Mock Data (FULL ITINERARY 24 Days) ---
const initialSchedule: DaySchedule[] = [
  // --- TAIWAN -> NETHERLANDS ---
  {
    date: "2026-09-18", weather: "cloudy", temp: "28°C",
    items: [
      { id: '1-1', time: "16:30", title: "搭高鐵前往機場", location: "左營 -> 桃園", category: "transport" },
      { id: '1-2', time: "20:00", title: "桃園機場第一航廈報到", location: "TPE T1", category: "transport", note: "華航 C173" },
      { id: '1-3', time: "22:50", title: "搭機前往阿姆斯特丹", location: "TPE -> AMS", category: "flight", note: "飛行 14h 50m" }
    ]
  },
  // --- NETHERLANDS -> ICELAND ---
  {
    date: "2026-09-19", weather: "rainy", temp: "8°C",
    items: [
      { id: '2-1', time: "07:40", title: "抵達阿姆斯特丹 (轉機)", location: "AMS Airport", category: "transport", note: "轉機 6.5 小時，吃午餐" },
      { id: '2-2', time: "14:10", title: "搭機前往冰島", location: "AMS -> KEF (FI501)", category: "flight" },
      { id: '2-3', time: "15:25", title: "抵達冰島 & 取車", location: "KEF Airport", category: "car", note: "Kia Sorento 4WD" },
      { id: '2-4', time: "16:30", title: "藍湖溫泉 (Blue Lagoon)", location: "Grindavík", category: "activity", note: "停留約 2hr" },
      { id: '2-5', time: "19:00", title: "入住 Brautarholt 20", location: "Reykjavik", category: "stay", note: "小豬超市採買" }
    ]
  },
  // --- ICELAND: Golden Circle ---
  {
    date: "2026-09-20", weather: "sunny", temp: "10°C",
    items: [
      { id: '3-1', time: "09:00", title: "前往辛格韋德利國家公園", location: "Þingvellir", category: "activity", note: "車程 44 min" },
      { id: '3-2', time: "12:00", title: "史托克間歇噴泉", location: "Strokkur Geysir", category: "activity", note: "車程 48 min" },
      { id: '3-3', time: "14:00", title: "古佛斯瀑布 (黃金瀑布)", location: "Gullfoss", category: "activity", note: "車程 11 min" },
      { id: '3-4', time: "18:00", title: "入住 Midgard Base Camp", location: "Hvolsvöllur", category: "stay", note: "車程 1h 18m" }
    ]
  },
  // --- ICELAND: South Coast ---
  {
    date: "2026-09-21", weather: "cloudy", temp: "9°C",
    items: [
      { id: '4-1', time: "09:00", title: "塞里雅蘭瀑布", location: "Seljalandsfoss", category: "activity" },
      { id: '4-2', time: "10:30", title: "史可加瀑布 (彩虹瀑布)", location: "Skógafoss", category: "activity" },
      { id: '4-3', time: "13:00", title: "飛機殘骸 (需健行)", location: "Solheimasandur", category: "activity", note: "徒步單程 45min 或搭接駁車" },
      { id: '4-4', time: "15:30", title: "Dyrhólaey 海岬觀景台", location: "Dyrhólaey", category: "activity" },
      { id: '4-5', time: "16:30", title: "黑沙灘 & 玄武岩壁", location: "Reynisfjara", category: "activity" },
      { id: '4-6', time: "19:00", title: "入住 Black Beach Suites", location: "Vík", category: "stay" }
    ]
  },
  // --- ICELAND: Glacier & Lagoon ---
  {
    date: "2026-09-22", weather: "cloudy", temp: "5°C",
    items: [
      { id: '5-1', time: "09:30", title: "斯卡夫塔山冰川健行", location: "Skaftafell", category: "activity", note: "3小時行程, 集合點: Skaftafell Terminal" },
      { id: '5-2', time: "14:00", title: "傑古沙龍冰河湖 & 鑽石沙灘", location: "Jökulsárlón", category: "activity", note: "車程約 1h 50m" },
      { id: '5-3', time: "17:00", title: "前往赫本 (龍蝦鎮)", location: "Höfn", category: "transport", note: "車程 1h, 加油採買" },
      { id: '5-4', time: "18:00", title: "入住 Milk Factory", location: "Höfn", category: "stay" }
    ]
  },
  // --- ICELAND: East Fjords ---
  {
    date: "2026-09-23", weather: "rainy", temp: "6°C",
    items: [
      { id: '6-1', time: "10:00", title: "東部峽灣海岸公路", location: "East Fjords", category: "transport", note: "沿途欣賞峽灣美景" },
      { id: '6-2', time: "14:00", title: "塞濟斯菲厄澤 (白日夢冒險王小鎮)", location: "Seyðisfjörður", category: "activity", note: "彩虹教堂、滑板公路" },
      { id: '6-3', time: "18:00", title: "入住 Ormurinn Guesthouse", location: "Egilsstaðir", category: "stay" }
    ]
  },
  // --- ICELAND: Diamond Circle ---
  {
    date: "2026-09-24", weather: "cloudy", temp: "4°C",
    items: [
      { id: '7-1', time: "09:00", title: "黛提瀑布 (魔鬼瀑布)", location: "Dettifoss (West Side)", category: "activity", note: "歐洲水量最大瀑布" },
      { id: '7-2', time: "13:00", title: "地熱谷 Hverir", location: "Námafjall", category: "activity", note: "沸騰泥漿池" },
      { id: '7-3', time: "15:00", title: "米湖溫泉", location: "Mývatn Nature Baths", category: "activity", note: "北部藍湖" },
      { id: '7-4', time: "19:00", title: "入住 Guesthouse Stöng", location: "Mývatn Area", category: "stay" }
    ]
  },
  // --- ICELAND: North -> West ---
  {
    date: "2026-09-25", weather: "sunny", temp: "5°C",
    items: [
      { id: '8-1', time: "09:00", title: "上帝瀑布 (眾神瀑布)", location: "Goðafoss", category: "activity" },
      { id: '8-2', time: "11:00", title: "阿克雷里市區觀光", location: "Akureyri", category: "activity", note: "愛心紅綠燈" },
      { id: '8-3', time: "13:00", title: "阿克雷里賞鯨團", location: "Akureyri Harbor", category: "activity", note: "行程約 3 小時" },
      { id: '8-4', time: "19:00", title: "入住 Bólstaðarhlíð Cottage", location: "Blönduós", category: "stay" }
    ]
  },
  // --- ICELAND: Snæfellsnes ---
  {
    date: "2026-09-26", weather: "cloudy", temp: "7°C",
    items: [
      { id: '9-1', time: "09:00", title: "鯨魚教堂", location: "Blönduós Church", category: "activity" },
      { id: '9-2', time: "12:00", title: "教會山 (草帽山)", location: "Kirkjufell", category: "activity", note: "權力遊戲場景" },
      { id: '9-3', time: "15:00", title: "黑教堂", location: "Búðakirkja", category: "activity" },
      { id: '9-4', time: "16:30", title: "海豹沙灘", location: "Ytri Tunga", category: "activity" },
      { id: '9-5', time: "19:00", title: "返回雷克雅維克入住", location: "Brautarholt 20", category: "stay" }
    ]
  },
  // --- ICELAND: Volcano Tour ---
  {
    date: "2026-09-27", weather: "sunny", temp: "9°C",
    items: [
      { id: '10-1', time: "09:30", title: "火山內部探險集合", location: "Reykjavik", category: "activity", note: "Thrihnukagigur Volcano Tour" },
      { id: '10-2', time: "10:00", title: "進入火山內部", location: "Inside the Volcano", category: "activity", note: "行程約 6 小時" },
      { id: '10-3', time: "16:00", title: "探險結束", location: "Base Camp", category: "activity" },
      { id: '10-4', time: "18:00", title: "市區觀光 / 晚餐", location: "Reykjavik", category: "food" },
      { id: '10-5', time: "21:00", title: "續住 Brautarholt 20", location: "Reykjavik", category: "stay" }
    ]
  },
  // --- ICELAND -> NORWAY ---
  {
    date: "2026-09-28", weather: "rainy", temp: "11°C",
    items: [
      { id: '11-1', time: "07:00", title: "機場還車", location: "KEF Airport", category: "transport" },
      { id: '11-2', time: "10:10", title: "搭機前往卑爾根", location: "KEF -> BGO (FI334)", category: "flight" },
      { id: '11-3', time: "14:30", title: "抵達挪威卑爾根", location: "BGO Airport", category: "transport" },
      { id: '11-4', time: "17:00", title: "卑爾根魚市場晚餐", location: "Fish Market", category: "food" },
      { id: '11-5', time: "19:00", title: "布呂根木屋夜景", location: "Bryggen", category: "activity" },
      { id: '11-6', time: "21:00", title: "入住 BREEZE Hotel Victoria", location: "Bergen", category: "stay" }
    ]
  },
  // --- NORWAY: Nutshell Part 1 ---
  {
    date: "2026-09-29", weather: "cloudy", temp: "10°C",
    items: [
      { id: '12-1', time: "10:36", title: "火車: Bergen -> Voss", location: "Bergen Station", category: "transport", note: "R40 (1h 20m)" },
      { id: '12-2', time: "12:57", title: "巴士: Voss -> Gudvangen", location: "Voss Station", category: "transport", note: "VY450 (1h)" },
      { id: '12-3', time: "14:30", title: "峽灣遊船: Gudvangen -> Flåm", location: "Nærøyfjord", category: "activity", note: "世界遺產峽灣 (2h)" },
      { id: '12-4', time: "16:30", title: "抵達 Flåm 小鎮", location: "Flåm", category: "activity" },
      { id: '12-5', time: "18:00", title: "入住 Flåm Hostel", location: "Flåm", category: "stay" }
    ]
  },
  // --- NORWAY: Nutshell Part 2 -> Oslo ---
  {
    date: "2026-09-30", weather: "sunny", temp: "12°C",
    items: [
      { id: '13-1', time: "09:00", title: "Stegastein 觀景台 (選)", location: "Flåm", category: "activity", note: "或在小鎮悠閒時光" },
      { id: '13-2', time: "11:45", title: "高山小火車: Flåm -> Myrdal", location: "Flåm Station", category: "transport", note: "R45" },
      { id: '13-3', time: "12:28", title: "轉乘火車前往奧斯陸", location: "Myrdal Station", category: "transport", note: "車程 4h 55m" },
      { id: '13-4', time: "17:30", title: "抵達奧斯陸中央車站", location: "Oslo S", category: "transport" },
      { id: '13-5', time: "18:30", title: "入住 Citybox Oslo", location: "Oslo", category: "stay" }
    ]
  },
  // --- NORWAY -> SWEDEN ---
  {
    date: "2026-10-01", weather: "cloudy", temp: "11°C",
    items: [
      { id: '14-1', time: "09:00", title: "奧斯陸市區觀光", location: "Oslo", category: "activity", note: "孟克博物館、歌劇院" },
      { id: '14-2', time: "15:00", title: "搭機場快線前往機場", location: "Oslo S -> OSL", category: "transport" },
      { id: '14-3', time: "17:50", title: "搭機前往斯德哥爾摩", location: "OSL -> ARN (SK488)", category: "flight" },
      { id: '14-4', time: "18:50", title: "抵達斯德哥爾摩", location: "Stockholm", category: "transport" },
      { id: '14-5', time: "20:30", title: "入住 Scandic Södra Kajen", location: "Stockholm", category: "stay" }
    ]
  },
  // --- SWEDEN: Stockholm ---
  {
    date: "2026-10-02", weather: "sunny", temp: "13°C",
    items: [
      { id: '15-1', time: "09:00", title: "舊城區 Gamla Stan", location: "Old Town", category: "activity" },
      { id: '15-2', time: "11:00", title: "斯德哥爾摩王宮", location: "Royal Palace", category: "activity" },
      { id: '15-3', time: "14:00", title: "諾貝爾博物館", location: "Nobel Prize Museum", category: "activity" },
      { id: '15-4', time: "16:00", title: "動物園島", location: "Djurgården", category: "activity" },
      { id: '15-5', time: "19:00", title: "續住 Scandic Södra Kajen", location: "Stockholm", category: "stay" }
    ]
  },
  // --- SWEDEN: Museums ---
  {
    date: "2026-10-03", weather: "cloudy", temp: "12°C",
    items: [
      { id: '16-1', time: "09:00", title: "瓦薩沈船博物館", location: "Vasa Museum", category: "activity" },
      { id: '16-2', time: "13:00", title: "斯坎森露天博物館", location: "Skansen", category: "activity" },
      { id: '16-3', time: "18:00", title: "市區逛街", location: "Norrmalm", category: "shopping" },
      { id: '16-4', time: "20:00", title: "續住 Scandic Södra Kajen", location: "Stockholm", category: "stay" }
    ]
  },
  // --- SWEDEN -> FINLAND (Cruise) ---
  {
    date: "2026-10-04", weather: "sunny", temp: "12°C",
    items: [
      { id: '17-1', time: "10:00", title: "地鐵藝術巡禮 / 國王花園", location: "T-Centralen", category: "activity" },
      { id: '17-2', time: "15:30", title: "前往碼頭報到", location: "Värtahamnen Terminal", category: "transport" },
      { id: '17-3', time: "16:45", title: "搭乘詩麗雅號郵輪", location: "Silja Symphony", category: "transport", note: "前往赫爾辛基 (過夜)" },
      { id: '17-4', time: "18:00", title: "郵輪晚餐 & 設施", location: "Onboard", category: "food" },
      { id: '17-5', time: "21:00", title: "夜宿郵輪", location: "Silja Line Cabin", category: "stay" }
    ]
  },
  // --- FINLAND -> ROVANIEMI (Night Train) ---
  {
    date: "2026-10-05", weather: "cloudy", temp: "10°C",
    items: [
      { id: '18-1', time: "10:30", title: "抵達赫爾辛基", location: "Olympia Terminal", category: "transport" },
      { id: '18-2', time: "12:00", title: "岩石教堂", location: "Temppeliaukio", category: "activity" },
      { id: '18-3', time: "14:00", title: "市區觀光", location: "Helsinki", category: "activity" },
      { id: '18-4', time: "19:00", title: "前往中央車站搭乘夜臥火車", location: "Helsinki Central", category: "transport", note: "Santa Claus Express" },
      { id: '18-5', time: "23:00", title: "夜宿北極特快車", location: "VR Train", category: "stay", note: "前往羅瓦涅米" }
    ]
  },
  // --- FINLAND: Santa Claus Village ---
  {
    date: "2026-10-06", weather: "snowy", temp: "-2°C",
    items: [
      { id: '19-1', time: "10:00", title: "抵達羅瓦涅米", location: "Rovaniemi", category: "transport" },
      { id: '19-2', time: "11:00", title: "聖誕老人村", location: "Santa Claus Village", category: "activity", note: "跨越北極圈線" },
      { id: '19-3', time: "13:00", title: "聖誕老人郵局寄明信片", location: "Post Office", category: "activity" },
      { id: '19-4', time: "18:00", title: "入住玻璃極光屋", location: "Glass Igloo", category: "stay", note: "或市區飯店" }
    ]
  },
  // --- FINLAND: Arctic Museum ---
  {
    date: "2026-10-07", weather: "snowy", temp: "-3°C",
    items: [
      { id: '20-1', time: "10:00", title: "極地博物館", location: "Arktikum", category: "activity", note: "了解薩米文化" },
      { id: '20-2', time: "14:00", title: "哈士奇農場 / 馴鹿農場", location: "Local Farm", category: "activity", note: "體驗雪橇 (視雪況)" },
      { id: '20-3', time: "19:00", title: "入住羅瓦涅米市區", location: "Rovaniemi", category: "stay" }
    ]
  },
  // --- FINLAND -> HELSINKI ---
  {
    date: "2026-10-08", weather: "cloudy", temp: "5°C",
    items: [
      { id: '21-1', time: "12:00", title: "前往機場報到", location: "RVN Airport", category: "transport" },
      { id: '21-2', time: "14:15", title: "搭機返回赫爾辛基", location: "RVN -> HEL (AY534)", category: "flight" },
      { id: '21-3', time: "15:30", title: "抵達赫爾辛基", location: "HEL Airport", category: "transport" },
      { id: '21-4', time: "17:00", title: "入住赫爾辛基市區飯店", location: "Helsinki", category: "stay" }
    ]
  },
  // --- ESTONIA: Tallinn Day Trip ---
  {
    date: "2026-10-09", weather: "sunny", temp: "8°C",
    items: [
      { id: '22-1', time: "07:30", title: "快艇: 赫爾辛基 -> 塔林", location: "West Terminal T2", category: "transport", note: "無垠星際號 (2h)" },
      { id: '22-2', time: "09:30", title: "抵達愛沙尼亞塔林", location: "Tallinn D-Terminal", category: "activity" },
      { id: '22-3', time: "10:30", title: "塔林舊城區一日遊", location: "Tallinn Old Town", category: "activity", note: "中世紀古城" },
      { id: '22-4', time: "19:30", title: "快艇: 塔林 -> 赫爾辛基", location: "Tallinn D-Terminal", category: "transport", note: "無垠星際號" },
      { id: '22-5', time: "22:00", title: "返回赫爾辛基飯店", location: "Helsinki", category: "stay" }
    ]
  },
  // --- FINLAND -> HOME ---
  {
    date: "2026-10-10", weather: "cloudy", temp: "7°C",
    items: [
      { id: '23-1', time: "09:00", title: "赫爾辛基座堂 (白教堂)", location: "Senate Square", category: "activity" },
      { id: '23-2', time: "11:00", title: "烏斯佩斯基大教堂 (紅教堂)", location: "Katajanokka", category: "activity" },
      { id: '23-3', time: "14:00", title: "設計區 / Oodi 中央圖書館", location: "Design District", category: "shopping" },
      { id: '23-4', time: "21:00", title: "搭火車前往機場", location: "Central Station -> HEL", category: "transport" },
      { id: '23-5', time: "21:35", title: "機場報到", location: "HEL Airport", category: "transport" }
    ]
  },
  {
    date: "2026-10-11", weather: "sunny", temp: "25°C",
    items: [
      { id: '24-1', time: "00:35", title: "搭機返台 (第一段)", location: "HEL -> HKG (AY99)", category: "flight", note: "12h 05m" },
      { id: '24-2', time: "17:40", title: "抵達香港轉機", location: "HKG Airport", category: "transport", note: "轉機 3h" },
      { id: '24-3', time: "20:40", title: "搭機返台 (第二段)", location: "HKG -> KHH (CI936)", category: "flight" },
      { id: '24-4', time: "22:10", title: "平安抵達高雄", location: "KHH Airport", category: "transport" }
    ]
  }
];

const initialBookings: Booking[] = [
  { id: 'b1', type: 'flight', title: 'China Airlines', subtitle: 'CI 173', date: '2026-09-18', details: [{ label: 'DEP', value: 'TPE 22:50' }, { label: 'ARR', value: 'AMS 07:40' }, { label: 'Seat', value: '32A, 32B' }], refNumber: 'R6X9JP', status: 'confirmed' },
  { id: 'b2', type: 'flight', title: 'Icelandair', subtitle: 'FI 501', date: '2026-09-19', details: [{ label: 'DEP', value: 'AMS 14:10' }, { label: 'ARR', value: 'KEF 15:25' }], refNumber: 'ISL772', status: 'confirmed' },
  { id: 'b3', type: 'car', title: 'Blue Car Rental', subtitle: 'Kia Sorento 4WD', date: '2026-09-19', details: [{ label: 'Pick-up', value: 'KEF 16:30' }, { label: 'Drop-off', value: 'KEF 07:00' }, { label: 'Duration', value: '9 Days' }], refNumber: 'BCR-9921', status: 'confirmed' },
  { id: 'b4', type: 'stay', title: 'Brautarholt 20', subtitle: 'Reykjavik Apartment', date: '2026-09-19', details: [{ label: 'Check-in', value: '15:00' }, { label: 'Guests', value: '4 Adults' }], refNumber: 'B-88219', status: 'confirmed' },
  { id: 'b5', type: 'transport', title: 'Silja Symphony', subtitle: 'Overnight Cruise', date: '2026-10-04', details: [{ label: 'DEP', value: 'STO 16:45' }, { label: 'ARR', value: 'HEL 10:30' }], refNumber: 'SIL-990', status: 'confirmed' },
  { id: 'b6', type: 'transport', title: 'VR Night Train', subtitle: 'Santa Claus Express', date: '2026-10-05', details: [{ label: 'DEP', value: 'HEL 23:00' }, { label: 'ARR', value: 'RVN 10:00' }], refNumber: 'VR-882', status: 'confirmed' },
];

const initialExpenses: Expense[] = [
  { id: 'e1', title: 'Kia Sorento 租車費', amount: 251617, currency: 'ISK', category: 'transport', date: '2026-09-19', payer: '依如' },
  { id: 'e2', title: '藍湖溫泉門票', amount: 17990, currency: 'ISK', category: 'activity', date: '2026-09-19', payer: 'Me' },
  { id: 'e3', title: 'Brautarholt 20 住宿', amount: 336.96, currency: 'EUR', category: 'stay', date: '2026-09-19', payer: '老妹' },
  { id: 'e4', title: '小豬超市採買', amount: 8500, currency: 'ISK', category: 'food', date: '2026-09-19', payer: 'Me' },
];

const initialMembers: Member[] = [
  { id: 'm1', name: 'Me', role: 'Organizer', avatarColor: 'bg-nordic-primary' },
  { id: 'm2', name: '老妹', role: 'Finance', avatarColor: 'bg-pink-400' },
  { id: 'm3', name: '依如', role: 'Driver', avatarColor: 'bg-emerald-400' },
  { id: 'm4', name: '神秘旅伴', role: 'Member', avatarColor: 'bg-amber-400' },
];

const initialPosts: JournalPost[] = [
  { id: 'p1', content: '終於抵達冰島了！這空氣太棒了！ 🇮🇸✈️', date: '2026-09-19', location: 'Keflavík International Airport', imageColor: 'bg-blue-200', author: 'Me', likes: 12 },
  { id: 'p2', content: '藍湖溫泉真的很夢幻，皮膚變超滑～', date: '2026-09-19', location: 'Blue Lagoon', imageColor: 'bg-cyan-100', author: '老妹', likes: 24 },
];

// --- 4. UI Components ---
const CategoryIcon = ({ type, className = "" }: { type: string, className?: string }) => {
  const props = { className };
  switch (type) {
    case 'flight': return <FontAwesomeIcon icon={faPlane} {...props} />;
    case 'stay': return <FontAwesomeIcon icon={faBed} {...props} />;
    case 'car': return <FontAwesomeIcon icon={faCar} {...props} />;
    case 'transport': return <FontAwesomeIcon icon={faBus} {...props} />;
    case 'food': return <FontAwesomeIcon icon={faUtensils} {...props} />;
    case 'shopping': return <FontAwesomeIcon icon={faShoppingBag} {...props} />;
    case 'activity': return <FontAwesomeIcon icon={faTicketAlt} {...props} />;
    default: return <FontAwesomeIcon icon={faReceipt} {...props} />;
  }
};

const WeatherIcon = ({ type }: { type?: string }) => {
  if (type === 'sunny') return <FontAwesomeIcon icon={faCloudSun} className="text-yellow-500" />;
  if (type === 'rainy') return <FontAwesomeIcon icon={faCloudRain} className="text-blue-400" />;
  if (type === 'snowy') return <FontAwesomeIcon icon={faSnowflake} className="text-cyan-300" />;
  return <FontAwesomeIcon icon={faCloudSun} className="text-gray-400" />;
};

// --- 5. Main App Component ---
function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-19");
  
  // Bookings State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);

  // Expense State
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCurrency, setNewExpenseCurrency] = useState<CurrencyCode>('ISK');
  const [newExpenseCategory, setNewExpenseCategory] = useState<CategoryType>('food');
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpensePayer, setNewExpensePayer] = useState("Me");

  // Journal State
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>(initialPosts);
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  // Helpers
  const daysUntilTrip = useMemo(() => differenceInDays(parseISO(TRIP_START_DATE), new Date()), []);
  const dateList = useMemo(() => {
    const dates = [];
    let currentDate = parseISO(TRIP_START_DATE);
    const endDate = parseISO(TRIP_END_DATE);
    while (currentDate <= endDate) {
      dates.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate = addDays(currentDate, 1);
    }
    return dates;
  }, []);
  const currentSchedule = initialSchedule.find(d => d.date === selectedDate);

  const totalExpenseTWD = useMemo(() => expenses.reduce((sum, item) => sum + (item.amount * EXCHANGE_RATES[item.currency]), 0), [expenses]);

  const memberSpending = useMemo(() => {
    const spending: Record<string, number> = {};
    initialMembers.forEach(m => spending[m.name] = 0);
    expenses.forEach(e => {
      const twd = e.amount * EXCHANGE_RATES[e.currency];
      if (spending[e.payer] !== undefined) spending[e.payer] += twd;
      else spending[e.payer] = twd;
    });
    return Object.entries(spending).sort(([,a], [,b]) => b - a);
  }, [expenses]);

  const handleUnlock = () => {
    if (pinInput === PIN_CODE) { setIsUnlocked(true); setShowPinModal(false); setPinInput(""); } 
    else { alert("密碼錯誤 (提示: 0829)"); setPinInput(""); }
  };

  const handleAddExpense = () => {
    if (!newExpenseAmount || !newExpenseTitle) return;
    const newExp: Expense = {
      id: Date.now().toString(),
      title: newExpenseTitle,
      amount: parseFloat(newExpenseAmount),
      currency: newExpenseCurrency,
      category: newExpenseCategory,
      date: format(new Date(), 'yyyy-MM-dd'),
      payer: newExpensePayer
    };
    setExpenses([newExp, ...expenses]);
    setShowAddExpense(false);
    setNewExpenseAmount("");
    setNewExpenseTitle("");
  };

  const handleAddPost = () => {
    if (!newPostContent) return;
    const newPost: JournalPost = {
      id: Date.now().toString(),
      content: newPostContent,
      date: format(new Date(), 'yyyy-MM-dd'),
      location: 'New Location',
      imageColor: 'bg-gray-200',
      author: 'Me',
      likes: 0
    };
    setJournalPosts([newPost, ...journalPosts]);
    setShowAddPost(false);
    setNewPostContent("");
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'back') setNewExpenseAmount(prev => prev.slice(0, -1));
    else if (val === '.') { if (!newExpenseAmount.includes('.')) setNewExpenseAmount(prev => prev + val); }
    else if (newExpenseAmount.length < 8) setNewExpenseAmount(prev => prev + val);
  };

  return (
    <div className="min-h-screen bg-nordic-bg font-sans pb-24 text-nordic-text">
      
      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 text-2xl"><FontAwesomeIcon icon={faLock} /></div>
            <h3 className="text-xl font-bold mb-6">安全驗證</h3>
            <input type="password" maxLength={4} value={pinInput} onChange={(e) => setPinInput(e.target.value)} className="w-full text-center text-3xl tracking-[1em] font-bold border-b-2 border-gray-200 focus:border-nordic-primary outline-none py-2 mb-8 bg-transparent" placeholder="••••" />
            <div className="flex gap-4"><button onClick={() => setShowPinModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 font-bold">取消</button><button onClick={handleUnlock} className="flex-1 py-3 rounded-xl bg-nordic-primary text-white font-bold">解鎖</button></div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-nordic-bg z-[70] flex flex-col fade-in">
          <div className="p-4 flex justify-between items-center bg-white shadow-sm">
            <button onClick={() => setShowAddExpense(false)} className="text-gray-400 p-2"><FontAwesomeIcon icon={faTimes} className="text-xl" /></button>
            <h3 className="font-bold text-lg">記一筆</h3>
            <button onClick={handleAddExpense} className="text-nordic-primary font-bold p-2">儲存</button>
          </div>
          <div className="flex-1 flex flex-col p-6">
            <div className="mb-6 text-center">
              <div className="flex justify-center items-end gap-2 text-nordic-primary">
                <span className="text-2xl font-bold mb-2">{newExpenseCurrency}</span>
                <span className="text-6xl font-bold tracking-tight">{newExpenseAmount || '0'}</span>
              </div>
              <p className="text-nordic-muted text-sm mt-2">≈ TWD {formatCurrency((parseFloat(newExpenseAmount) || 0) * EXCHANGE_RATES[newExpenseCurrency], 'TWD')}</p>
            </div>
            <input type="text" placeholder="消費項目 (如: 晚餐)" value={newExpenseTitle} onChange={(e) => setNewExpenseTitle(e.target.value)} className="w-full bg-white p-4 rounded-xl text-center font-bold text-lg mb-4 shadow-sm outline-none" />
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
              {['food', 'transport', 'stay', 'activity', 'shopping'].map((cat) => (
                <button key={cat} onClick={() => setNewExpenseCategory(cat as CategoryType)} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${newExpenseCategory === cat ? 'bg-nordic-text text-white' : 'bg-white text-gray-500 border border-gray-100'}`}><CategoryIcon type={cat} /><span>{cat === 'food' ? '餐飲' : cat === 'transport' ? '交通' : cat === 'stay' ? '住宿' : cat === 'activity' ? '娛樂' : '購物'}</span></button>
              ))}
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                {initialMembers.map(m => (
                    <button key={m.id} onClick={() => setNewExpensePayer(m.name)} className={`px-4 py-1 rounded-lg text-sm font-bold border ${newExpensePayer === m.name ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-400 border-gray-100'}`}>{m.name}</button>
                ))}
            </div>
            <div className="flex gap-2 mb-6">
              {['ISK', 'EUR', 'NOK', 'TWD'].map(curr => (<button key={curr} onClick={() => setNewExpenseCurrency(curr as CurrencyCode)} className={`flex-1 py-2 rounded-lg font-bold text-sm ${newExpenseCurrency === curr ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>{curr}</button>))}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (<button key={num} onClick={() => handleKeypadPress(num.toString())} className="bg-white rounded-2xl p-4 text-2xl font-bold text-nordic-text shadow-sm active:bg-gray-50 active:scale-95 transition-all">{num}</button>))}
              <button onClick={() => handleKeypadPress('back')} className="bg-gray-100 rounded-2xl p-4 text-xl text-gray-600 shadow-sm active:scale-95"><FontAwesomeIcon icon={faBackspace} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {showAddPost && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-6 backdrop-blur-sm fade-in">
           <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <h3 className="font-bold">新增貼文</h3>
                  <button onClick={() => setShowAddPost(false)}><FontAwesomeIcon icon={faTimes} className="text-gray-400"/></button>
              </div>
              <div className="aspect-square bg-gray-100 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
                  <FontAwesomeIcon icon={faImage} className="text-4xl mb-2"/>
                  <span className="text-sm font-bold">點擊上傳照片</span>
              </div>
              <div className="p-4">
                  <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="寫下你的心情..." className="w-full h-24 resize-none outline-none text-nordic-text placeholder-gray-300"></textarea>
                  <button onClick={handleAddPost} className="w-full bg-nordic-primary text-white py-3 rounded-xl font-bold mt-2 shadow-lg shadow-blue-200">發佈</button>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-b-3xl shadow-soft sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div><h1 className="text-2xl font-bold tracking-tight">Nordic Trek</h1><p className="text-nordic-muted text-sm font-medium">2026 冰島+北歐三國</p></div>
          <div className="text-right"><span className="block text-3xl font-bold text-nordic-primary">{daysUntilTrip}</span><span className="text-xs text-nordic-muted font-bold uppercase tracking-wider">Days to go</span></div>
        </div>

        {activeTab === 'schedule' && (
          <div className="flex overflow-x-auto space-x-3 no-scrollbar py-2">
            {dateList.map((date) => {
              const isSelected = date === selectedDate;
              return (
                <button key={date} onClick={() => setSelectedDate(date)} className={`flex-shrink-0 w-14 h-18 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border ${isSelected ? 'bg-nordic-primary border-nordic-primary text-white shadow-md transform scale-105' : 'bg-white border-gray-100 text-nordic-text'}`}>
                  <span className="text-[10px] font-bold uppercase mb-1 opacity-80">{format(parseISO(date), 'EEE')}</span>
                  <span className="text-lg font-bold">{format(parseISO(date), 'd')}</span>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-800"><FontAwesomeIcon icon={faPassport} /><span>我的憑證</span></div>
            <button onClick={() => isUnlocked ? setIsUnlocked(false) : setShowPinModal(true)} className={`text-sm font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-2 ${isUnlocked ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}><FontAwesomeIcon icon={isUnlocked ? faUnlock : faLock} />{isUnlocked ? '已解鎖' : '隱私保護'}</button>
          </div>
        )}

        {activeTab === 'expense' && (
           <div className="bg-nordic-text text-white p-4 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-xs opacity-70 mb-1">總支出估算 (TWD)</p>
               <h2 className="text-3xl font-bold tracking-tight">{formatCurrency(totalExpenseTWD, 'TWD')}</h2>
               <div className="mt-3 flex gap-4 text-xs opacity-80">
                 <span><span className="font-bold">ISK</span> {formatCurrency(expenses.filter(e => e.currency === 'ISK').reduce((a,b)=>a+b.amount,0), 'ISK')}</span>
                 <span><span className="font-bold">EUR</span> {formatCurrency(expenses.filter(e => e.currency === 'EUR').reduce((a,b)=>a+b.amount,0), 'EUR')}</span>
               </div>
             </div>
             <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
           </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 fade-in max-w-lg mx-auto pb-24">
        
        {/* TAB 1: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 rounded-3xl text-white shadow-float relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 opacity-90 text-sm font-medium mb-1"><FontAwesomeIcon icon={faMapMarkerAlt} /><span>{currentSchedule?.items[0]?.location?.split(' ')[0] || '旅途中'}</span></div>
                  <h2 className="text-3xl font-bold">{currentSchedule ? format(parseISO(currentSchedule.date), 'M月d日', { locale: zhTW }) : ''}</h2>
                  <p className="opacity-90 mt-1">{currentSchedule?.weather === 'rainy' ? '陰雨綿綿' : currentSchedule?.weather === 'snowy' ? '浪漫雪景' : '天氣晴朗'}</p>
                </div>
                <div className="text-5xl opacity-90"><WeatherIcon type={currentSchedule?.weather} /></div>
              </div>
            </div>
            <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
              {currentSchedule?.items ? (
                currentSchedule.items.map((item) => (
                  <div key={item.id} className="relative pl-8 group">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.category === 'flight' ? 'bg-blue-500' : item.category === 'stay' ? 'bg-indigo-500' : 'bg-nordic-text'}`}></div>
                    <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-50/50">
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-gray-50 text-nordic-muted text-xs px-2 py-1 rounded-md font-mono font-bold flex items-center gap-2"><FontAwesomeIcon icon={faClock} className="text-[10px]" />{item.time}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-500`}><CategoryIcon type={item.category}/></div>
                      </div>
                      <h3 className="font-bold text-lg mb-1 leading-snug">{item.title}</h3>
                      {item.location && <div className="text-sm text-nordic-muted flex items-center gap-1.5 mb-3"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs opacity-70" />{item.location}</div>}
                      {item.note && <div className="bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-xl font-medium border border-amber-100">💡 {item.note}</div>}
                    </div>
                  </div>
                ))
              ) : <div className="pl-8 text-nordic-muted py-10">本日無詳細行程資料</div>}
            </div>
          </div>
        )}
        
        {/* TAB 2: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {initialBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-100">
                <div className={`p-4 flex justify-between items-center text-white ${booking.type === 'flight' ? 'bg-blue-500' : booking.type === 'car' ? 'bg-slate-700' : 'bg-emerald-500'}`}>
                   <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"><CategoryIcon type={booking.type} className="text-white"/></div><div><h3 className="font-bold text-lg leading-tight">{booking.title}</h3><p className="text-xs opacity-80 font-mono">{booking.subtitle}</p></div></div>
                </div>
                <div className="p-5 relative">
                   {booking.type === 'flight' && <div className="absolute top-0 left-0 w-full -translate-y-1/2 flex items-center justify-between px-2"><div className="w-4 h-4 bg-nordic-bg rounded-full"></div><div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2"></div><div className="w-4 h-4 bg-nordic-bg rounded-full"></div></div>}
                   <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">{booking.details.map((detail, idx) => (<div key={idx}><p className="text-xs text-nordic-muted uppercase tracking-wider font-bold mb-1">{detail.label}</p><p className="text-sm font-semibold text-nordic-text">{detail.value}</p></div>))}</div>
                   <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center border border-gray-100"><div><p className="text-[10px] text-gray-400 uppercase font-bold">Ref</p><p className="font-mono font-bold text-lg tracking-wider text-gray-700">{isUnlocked ? booking.refNumber : '••••••'}</p></div><button onClick={() => !isUnlocked && setShowPinModal(true)} className="text-gray-400 hover:text-nordic-primary p-2"><FontAwesomeIcon icon={isUnlocked ? faEye : faEyeSlash} /></button></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: EXPENSE */}
        {activeTab === 'expense' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-nordic-muted uppercase tracking-wider mb-2">最近支出</h3>
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-50">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${expense.currency === 'TWD' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'}`}><CategoryIcon type={expense.category} /></div>
                <div className="flex-1"><h4 className="font-bold text-nordic-text">{expense.title}</h4><div className="flex items-center gap-2 text-xs text-nordic-muted"><span>{expense.payer}</span><span>•</span><span>{expense.date}</span></div></div>
                <div className="text-right"><p className="font-bold text-lg">{formatCurrency(expense.amount, expense.currency)}</p>{expense.currency !== 'TWD' && <p className="text-xs text-nordic-muted">≈ {formatCurrency(expense.amount * EXCHANGE_RATES[expense.currency], 'TWD')}</p>}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: MEMBERS */}
        {activeTab === 'members' && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {initialMembers.map(m => (
                        <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm text-center border border-gray-50">
                            <div className={`w-16 h-16 ${m.avatarColor} rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold`}>{m.name[0]}</div>
                            <h3 className="font-bold text-nordic-text">{m.name}</h3>
                            <p className="text-xs text-nordic-muted">{m.role}</p>
                        </div>
                    ))}
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-soft">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><FontAwesomeIcon icon={faWallet} className="text-yellow-500"/> 代墊排行榜 (TWD)</h3>
                    <div className="space-y-4">
                        {memberSpending.map(([name, amount], idx) => (
                            <div key={name} className="flex items-center gap-3">
                                <span className={`font-bold w-4 text-center ${idx === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>{idx + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span>{name}</span>
                                        <span>{formatCurrency(amount, 'TWD')}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-nordic-primary rounded-full transition-all duration-500" style={{ width: `${(amount / (memberSpending[0][1] || 1)) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* TAB 5: JOURNAL */}
        {activeTab === 'journal' && (
            <div className="space-y-6">
                {journalPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-3xl shadow-soft overflow-hidden">
                        <div className={`aspect-[4/3] ${post.imageColor} flex items-center justify-center text-white/50 text-4xl`}>
                            <FontAwesomeIcon icon={faImage} />
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">{post.author[0]}</div>
                                    <span className="font-bold text-sm">{post.author}</span>
                                </div>
                                <span className="text-xs text-nordic-muted">{post.date}</span>
                            </div>
                            <p className="text-nordic-text leading-relaxed mb-3">{post.content}</p>
                            <div className="flex items-center gap-4 text-sm text-nordic-muted">
                                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faHeart} className="text-red-400"/> {post.likes}</span>
                                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faMapMarkerAlt}/> {post.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>

      {/* FABs */}
      {activeTab === 'expense' && (
        <button onClick={() => setShowAddExpense(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-nordic-text text-white rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-90 transition-transform z-40"><FontAwesomeIcon icon={faPlus} /></button>
      )}
      {activeTab === 'journal' && (
        <button onClick={() => setShowAddPost(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-tr from-pink-500 to-orange-400 text-white rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-90 transition-transform z-40"><FontAwesomeIcon icon={faCamera} /></button>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe pt-2 px-4 flex justify-between items-center z-50 h-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <NavButton icon={faBookOpen} label="行程" isActive={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
        <NavButton icon={faWallet} label="記帳" isActive={activeTab === 'expense'} onClick={() => setActiveTab('expense')} />
        <NavButton icon={faSuitcase} label="預訂" isActive={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
        <NavButton icon={faUserFriends} label="成員" isActive={activeTab === 'members'} onClick={() => setActiveTab('members')} />
        <NavButton icon={faPaperPlane} label="日誌" isActive={activeTab === 'journal'} onClick={() => setActiveTab('journal')} />
      </div>
    </div>
  );
}

const NavButton = ({ icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 w-14 transition-all duration-300 ${isActive ? 'text-nordic-primary -translate-y-1' : 'text-gray-400 hover:text-gray-600'}`}>
    <div className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}><FontAwesomeIcon icon={icon} /></div>
    <span className={`text-[9px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);

export default App;