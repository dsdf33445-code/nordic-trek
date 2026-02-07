// --- 3. Mock Data (FULL ITINERARY 24 Days) ---
import type { DaySchedule, Booking, Expense, Member, JournalPost } from '../types';

export const initialSchedule: DaySchedule[] = [
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

export const initialBookings: Booking[] = [
  { id: 'b1', type: 'flight', title: 'China Airlines', subtitle: 'CI 173', date: '2026-09-18', details: [{ label: 'DEP', value: 'TPE 22:50' }, { label: 'ARR', value: 'AMS 07:40' }, { label: 'Seat', value: '32A, 32B' }], refNumber: 'R6X9JP', status: 'confirmed' },
  { id: 'b2', type: 'flight', title: 'Icelandair', subtitle: 'FI 501', date: '2026-09-19', details: [{ label: 'DEP', value: 'AMS 14:10' }, { label: 'ARR', value: 'KEF 15:25' }], refNumber: 'ISL772', status: 'confirmed' },
  { id: 'b3', type: 'car', title: 'Blue Car Rental', subtitle: 'Kia Sorento 4WD', date: '2026-09-19', details: [{ label: 'Pick-up', value: 'KEF 16:30' }, { label: 'Drop-off', value: 'KEF 07:00' }, { label: 'Duration', value: '9 Days' }], refNumber: 'BCR-9921', status: 'confirmed' },
  { id: 'b4', type: 'stay', title: 'Brautarholt 20', subtitle: 'Reykjavik Apartment', date: '2026-09-19', details: [{ label: 'Check-in', value: '15:00' }, { label: 'Guests', value: '4 Adults' }], refNumber: 'B-88219', status: 'confirmed' },
  { id: 'b5', type: 'transport', title: 'Silja Symphony', subtitle: 'Overnight Cruise', date: '2026-10-04', details: [{ label: 'DEP', value: 'STO 16:45' }, { label: 'ARR', value: 'HEL 10:30' }], refNumber: 'SIL-990', status: 'confirmed' },
  { id: 'b6', type: 'transport', title: 'VR Night Train', subtitle: 'Santa Claus Express', date: '2026-10-05', details: [{ label: 'DEP', value: 'HEL 23:00' }, { label: 'ARR', value: 'RVN 10:00' }], refNumber: 'VR-882', status: 'confirmed' },
];

export const initialExpenses: Expense[] = [
  { id: 'e1', title: 'Kia Sorento 租車費', amount: 251617, currency: 'ISK', category: 'transport', date: '2026-09-19', payer: '毓邦' },
  { id: 'e2', title: '藍湖溫泉門票', amount: 17990, currency: 'ISK', category: 'activity', date: '2026-09-19', payer: '毓邦' },
  { id: 'e3', title: 'Brautarholt 20 住宿', amount: 336.96, currency: 'EUR', category: 'stay', date: '2026-09-19', payer: '毓邦' },
  { id: 'e4', title: '小豬超市採買', amount: 8500, currency: 'ISK', category: 'food', date: '2026-09-19', payer: '毓邦' },
];

export const initialMembers: Member[] = [
  { id: 'm1', name: '毓邦', role: 'Organizer', avatarColor: 'bg-nordic-primary' },
  { id: 'm2', name: '毓萱', role: 'Finance', avatarColor: 'bg-pink-400' },
  { id: 'm3', name: '依如', role: 'Driver', avatarColor: 'bg-emerald-400' },
  { id: 'm4', name: '家馨', role: 'Member', avatarColor: 'bg-amber-400' },
];

export const initialPosts: JournalPost[] = [
  { id: 'p1', content: '終於抵達冰島了！這空氣太棒了！ 🇮🇸✈️', date: '2026-09-19', location: 'Keflavík International Airport', imageColor: 'bg-blue-200', author: 'Me', likes: 12 },
  { id: 'p2', content: '藍湖溫泉真的很夢幻，皮膚變超滑～', date: '2026-09-19', location: 'Blue Lagoon', imageColor: 'bg-cyan-100', author: '老妹', likes: 24 },
];