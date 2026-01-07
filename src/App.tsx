import { useState, useMemo, useEffect } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faWallet, faSuitcase, faUserFriends, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// Firebase Imports
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';

// Types (使用 type-only import)
import type { Expense, JournalPost, DaySchedule, Booking } from './types';

// Helpers
import { TRIP_START_DATE, EXCHANGE_RATES, formatCurrency } from './utils/helpers';
// Mock Data (只用來做 Initial State 的空值結構，不再直接顯示)
import { initialMembers } from './data/mock';

// Views
import ScheduleView from './views/ScheduleView';
import BookingsView from './views/BookingsView';
import ExpenseView from './views/ExpenseView';
import MembersView from './views/MembersView';
import JournalView from './views/JournalView';

// Components
// import DataSeeder from './components/DataSeeder'; // 需要初始化資料時再打開

function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  
  // State 改為從 Firebase 讀取，初始值設為空陣列
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>([]);
  // 行程與預訂通常變動少，但為了同步也讀取雲端
  const [schedules, setSchedules] = useState<DaySchedule[]>([]); 
  const [bookings, setBookings] = useState<Booking[]>([]);

  // --- Firebase Realtime Listeners ---
  useEffect(() => {
    // 1. 監聽支出 (Expenses)
    const qExpenses = query(collection(db, "expenses"), orderBy("date", "desc"));
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Expense));
      setExpenses(data);
    });

    // 2. 監聽日誌 (Posts)
    const qPosts = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as JournalPost));
      setJournalPosts(data);
    });

    // 3. 監聽行程
    const qSchedules = query(collection(db, "schedules"), orderBy("date", "asc"));
    const unsubSchedules = onSnapshot(qSchedules, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as DaySchedule));
        setSchedules(data);
    });

    // 4. 監聽預訂 (Bookings)
    const qBookings = query(collection(db, "bookings"), orderBy("date", "asc"));
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Booking));
        setBookings(data);
    });

    return () => {
      // 組件卸載時取消監聽
      unsubExpenses();
      unsubPosts();
      unsubSchedules();
      unsubBookings();
    };
  }, []);

  // --- Actions (Write to Firebase) ---
  const handleAddExpenseToFirebase = async (newExpense: Expense) => {
    // 移除 id，讓 Firestore 自動生成 (或保留 id 若要自訂)
    // 這裡我們直接寫入，onSnapshot 會自動更新 UI，不需要手動 setExpenses
    try {
        const { id, ...data } = newExpense; // 剔除前端生成的暫時 ID
        await addDoc(collection(db, "expenses"), data);
    } catch (e) {
        console.error("Error adding expense: ", e);
        alert("新增失敗，請檢查網路");
    }
  };

  const handleAddPostToFirebase = async (newPost: JournalPost) => {
    try {
        const { id, ...data } = newPost;
        await addDoc(collection(db, "posts"), data);
    } catch (e) {
        console.error("Error adding post: ", e);
    }
  };

  // --- Calculations ---
  const daysUntilTrip = useMemo(() => differenceInDays(parseISO(TRIP_START_DATE), new Date()), []);
  const totalExpenseTWD = useMemo(() => expenses.reduce((sum, item) => sum + (item.amount * EXCHANGE_RATES[item.currency]), 0), [expenses]);

  return (
    <div className="min-h-screen bg-nordic-bg font-sans pb-24 text-nordic-text">
      {/* <DataSeeder /> */} 

      {/* Header */}
      <div className="bg-white p-6 rounded-b-3xl shadow-soft sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div><h1 className="text-2xl font-bold tracking-tight">Nordic Trek</h1><p className="text-nordic-muted text-sm font-medium">2026 冰島+北歐三國</p></div>
          <div className="text-right"><span className="block text-3xl font-bold text-nordic-primary">{daysUntilTrip}</span><span className="text-xs text-nordic-muted font-bold uppercase tracking-wider">Days to go</span></div>
        </div>

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

      {/* Main Content */}
      <div className="p-6 fade-in max-w-lg mx-auto pb-24">
        {activeTab === 'schedule' && <ScheduleView schedules={schedules} />}
        {activeTab === 'bookings' && <BookingsView bookings={bookings} />}
        {activeTab === 'expense' && <ExpenseView expenses={expenses} onAddExpense={handleAddExpenseToFirebase} />}
        {activeTab === 'members' && <MembersView expenses={expenses} />}
        {activeTab === 'journal' && <JournalView posts={journalPosts} onAddPost={handleAddPostToFirebase} />}
      </div>

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