import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlane, faHotel, faMapMarkerAlt, faUtensils, faCar, 
  faCheckCircle, faWallet, faBookOpen, faSuitcase, faUserFriends,
  faCloudSun, faCloudRain, faSnowflake, faClock, faCamera,
  faBed, faUnlock, faLock, faEye, faEyeSlash, faPassport,
  faPlus, faTimes, faReceipt, faShoppingBag, faTicketAlt, faBackspace, faPaperPlane, faImage, faHeart
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
  payer: string; // Name of the person
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
  imageColor: string; // Simulating an image
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

// --- 3. Mock Data ---
const initialSchedule: DaySchedule[] = [
  {
    date: "2026-09-18", weather: "cloudy", temp: "24°C",
    items: [
      { id: '1', time: "20:00", title: "桃園機場報到", location: "TPE 第一航廈", category: "transport", note: "華航 CI173" },
      { id: '2', time: "22:50", title: "起飛前往阿姆斯特丹", location: "TPE -> AMS", category: "flight" }
    ]
  },
  {
    date: "2026-09-19", weather: "rainy", temp: "8°C",
    items: [
      { id: '3', time: "14:10", title: "轉機前往冰島", location: "AMS -> KEF (FI501)", category: "flight" },
      { id: '4', time: "15:25", title: "抵達冰島 & 取車", location: "KEF Airport", category: "car", note: "Kia Sorento 4WD" },
      { id: '5', time: "16:30", title: "藍湖溫泉 (Blue Lagoon)", location: "Grindavík", category: "activity", note: "預約 17:00" },
      { id: '6', time: "19:00", title: "入住 Brautarholt 20", location: "Reykjavik", category: "stay", note: "小豬超市採買" }
    ]
  },
  {
    date: "2026-09-20", weather: "sunny", temp: "10°C",
    items: [
      { id: '7', time: "09:00", title: "金環之旅出發", location: "Thingvellir", category: "activity" },
      { id: '8', time: "12:00", title: "史托克間歇噴泉", location: "Geysir", category: "activity" },
      { id: '9', time: "14:00", title: "古佛斯瀑布", location: "Gullfoss", category: "activity" },
      { id: '10', time: "18:00", title: "入住 Midgard Base Camp", location: "Hvolsvöllur", category: "stay" }
    ]
  },
  {
    date: "2026-09-22", weather: "cloudy", temp: "5°C",
    items: [
      { id: '11', time: "09:30", title: "斯卡夫塔山冰川健行", location: "Skaftafell", category: "activity", note: "3小時行程" },
      { id: '12', time: "14:00", title: "傑古沙龍冰河湖 & 鑽石沙灘", location: "Jökulsárlón", category: "activity" },
      { id: '13', time: "18:00", title: "入住 Milk Factory", location: "Höfn", category: "stay" }
    ]
  }
];

const initialBookings: Booking[] = [
  {
    id: 'b1', type: 'flight', title: 'China Airlines', subtitle: 'CI 173', date: '2026-09-18',
    details: [{ label: 'DEP', value: 'TPE 22:50' }, { label: 'ARR', value: 'AMS 07:40' }, { label: 'Seat', value: '32A, 32B' }],
    refNumber: 'R6X9JP', status: 'confirmed'
  },
  {
    id: 'b3', type: 'car', title: 'Blue Car Rental', subtitle: 'Kia Sorento 4WD', date: '2026-09-19',
    details: [{ label: 'Pick-up', value: 'KEF 16:30' }, { label: 'Drop-off', value: 'KEF 07:00' }, { label: 'Duration', value: '9 Days' }],
    refNumber: 'BCR-9921', status: 'confirmed'
  },
  {
    id: 'b4', type: 'stay', title: 'Brautarholt 20', subtitle: 'Reykjavik Apartment', date: '2026-09-19',
    details: [{ label: 'Check-in', value: '15:00' }, { label: 'Guests', value: '4 Adults' }],
    refNumber: 'B-88219', status: 'confirmed'
  }
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
    case 'car': case 'transport': return <FontAwesomeIcon icon={faCar} {...props} />;
    case 'food': return <FontAwesomeIcon icon={faUtensils} {...props} />;
    case 'shopping': return <FontAwesomeIcon icon={faShoppingBag} {...props} />;
    case 'activity': return <FontAwesomeIcon icon={faTicketAlt} {...props} />;
    default: return <FontAwesomeIcon icon={faReceipt} {...props} />;
  }
};

const WeatherIcon = ({ type }: { type?: string }) => {
  if (type === 'sunny') return <FontAwesomeIcon icon={faCloudSun} className="text-yellow-500" />;
  if (type === 'rainy') return <FontAwesomeIcon icon={faCloudRain} className="text-blue-400" />;
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

  // Calculate Member Spending
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
      
      {/* --- PIN Modal --- */}
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

      {/* --- Add Expense Modal --- */}
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

      {/* --- Add Post Modal --- */}
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

      {/* --- Header --- */}
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

      {/* --- Main Content Area --- */}
      <div className="p-6 fade-in max-w-lg mx-auto pb-24">
        
        {/* TAB 1: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 rounded-3xl text-white shadow-float relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 opacity-90 text-sm font-medium mb-1"><FontAwesomeIcon icon={faMapMarkerAlt} /><span>冰島, Reykjavik</span></div>
                  <h2 className="text-3xl font-bold">{currentSchedule ? format(parseISO(currentSchedule.date), 'M月d日', { locale: zhTW }) : ''}</h2>
                  <p className="opacity-90 mt-1">{currentSchedule?.weather === 'rainy' ? '陰雨綿綿' : '天氣晴朗'}</p>
                </div>
                <div className="text-5xl opacity-90"><WeatherIcon type={currentSchedule?.weather} /></div>
              </div>
            </div>
            <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
              {currentSchedule?.items ? (
                currentSchedule.items.map((item) => (
                  <div key={item.id} className="relative pl-8 group">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.category === 'flight' ? 'bg-blue-500' : 'bg-nordic-text'}`}></div>
                    <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-50/50">
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-gray-50 text-nordic-muted text-xs px-2 py-1 rounded-md font-mono font-bold flex items-center gap-2"><FontAwesomeIcon icon={faClock} className="text-[10px]" />{item.time}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-500`}>{item.category === 'flight' ? <FontAwesomeIcon icon={faPlane} /> : <FontAwesomeIcon icon={faMapMarkerAlt} />}</div>
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