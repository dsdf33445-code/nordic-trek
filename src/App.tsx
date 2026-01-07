import { useState, useMemo, useEffect } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faWallet, faSuitcase, faUserFriends, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';

// 🔴 修正：補上 Member 型別
import type { Expense, JournalPost, DaySchedule, Booking, Member } from './types';

import { TRIP_START_DATE, EXCHANGE_RATES, formatCurrency } from './utils/helpers';

import ScheduleView from './views/ScheduleView';
import BookingsView from './views/BookingsView';
import ExpenseView from './views/ExpenseView';
import MembersView from './views/MembersView';
import JournalView from './views/JournalView';

// import DataSeeder from './components/DataSeeder'; 

function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>([]);
  const [schedules, setSchedules] = useState<DaySchedule[]>([]); 
  const [bookings, setBookings] = useState<Booking[]>([]);
  // 🔴 新增：成員狀態
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    // 1. Expenses
    const qExpenses = query(collection(db, "expenses"), orderBy("date", "desc"));
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Expense));
      setExpenses(data);
    });

    // 2. Posts
    const qPosts = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as JournalPost));
      setJournalPosts(data);
    });

    // 3. Schedules
    const qSchedules = query(collection(db, "schedules"), orderBy("date", "asc"));
    const unsubSchedules = onSnapshot(qSchedules, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as DaySchedule));
        setSchedules(data);
    });

    // 4. Bookings
    const qBookings = query(collection(db, "bookings"), orderBy("date", "asc"));
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Booking));
        setBookings(data);
    });

    // 🔴 5. 新增：監聽成員 Members
    const qMembers = query(collection(db, "members")); // 成員通常不用排序或可依 ID 排
    const unsubMembers = onSnapshot(qMembers, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Member));
        setMembers(data);
    });

    return () => {
      unsubExpenses();
      unsubPosts();
      unsubSchedules();
      unsubBookings();
      unsubMembers();
    };
  }, []);

  const handleAddExpenseToFirebase = async (newExpense: Expense) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = newExpense; 
        await addDoc(collection(db, "expenses"), data);
    } catch (e) {
        console.error("Error adding expense: ", e);
        alert("新增失敗，請檢查網路");
    }
  };

  const handleAddPostToFirebase = async (newPost: JournalPost) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = newPost;
        await addDoc(collection(db, "posts"), data);
    } catch (e) {
        console.error("Error adding post: ", e);
    }
  };

  const daysUntilTrip = useMemo(() => differenceInDays(parseISO(TRIP_START_DATE), new Date()), []);
  const totalExpenseTWD = useMemo(() => expenses.reduce((sum, item) => sum + (item.amount * EXCHANGE_RATES[item.currency]), 0), [expenses]);

  return (
    <div className="min-h-screen bg-nordic-bg font-sans pb-24 text-nordic-text">
      {/* <DataSeeder /> */}

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

      <div className="p-6 fade-in max-w-lg mx-auto pb-24">
        {activeTab === 'schedule' && <ScheduleView schedules={schedules} />}
        {activeTab === 'bookings' && <BookingsView bookings={bookings} />}
        
        {/* 🔴 修正：傳入 members 給 ExpenseView (為了選付款人) */}
        {activeTab === 'expense' && <ExpenseView expenses={expenses} members={members} onAddExpense={handleAddExpenseToFirebase} />}
        
        {/* 🔴 修正：傳入 members 給 MembersView */}
        {activeTab === 'members' && <MembersView expenses={expenses} members={members} />}
        
        {activeTab === 'journal' && <JournalView posts={journalPosts} onAddPost={handleAddPostToFirebase} />}
      </div>

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