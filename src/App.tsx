import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faPlane, 
  faWallet, 
  faBookOpen, 
  faUsers 
} from '@fortawesome/free-solid-svg-icons';

// Views
import ScheduleView from './views/ScheduleView';
import BookingsView from './views/BookingsView';
import ExpenseView from './views/ExpenseView';
import JournalView from './views/JournalView';
import MembersView from './views/MembersView';

// Types
import type { Expense, JournalPost } from './types';

// Data
import { 
  initialSchedule, 
  initialBookings, 
  initialExpenses, 
  initialMembers, 
  initialPosts 
} from './data/mock';

type Tab = 'schedule' | 'bookings' | 'expense' | 'journal' | 'members';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule');

  // [Fix] 使用 State 管理資料，這樣新增的資料才會即時顯示
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [posts, setPosts] = useState<JournalPost[]>(initialPosts);

  // [Fix] 定義新增功能
  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]); // 新的放前面
  };

  const handleAddPost = (newPost: JournalPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  // [Fix] 依賴 expenses State 計算總額，新增支出後標題金額會自動更新
  const currencyTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    expenses.forEach(item => {
      const currency = item.currency;
      if (totals[currency] !== undefined) {
        totals[currency] += item.amount;
      } else {
        totals[currency] = item.amount;
      }
    });

    return totals;
  }, [expenses]); // 這裡監聽 expenses 變化

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <ScheduleView schedules={initialSchedule} />;
      case 'bookings':
        return <BookingsView bookings={initialBookings} />;
      case 'expense':
        // [Fix] 補上 missing props: members, onAddExpense
        return <ExpenseView 
                 expenses={expenses} 
                 members={initialMembers} 
                 onAddExpense={handleAddExpense} 
               />;
      case 'journal':
        // [Fix] 補上 missing prop: onAddPost
        return <JournalView 
                 posts={posts} 
                 onAddPost={handleAddPost} 
               />;
      case 'members':
        // [Fix] 補上 missing prop: expenses (用於計算代墊)
        return <MembersView 
                 members={initialMembers} 
                 expenses={expenses} 
               />;
      default:
        return <ScheduleView schedules={initialSchedule} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-24">
      {/* Header Area */}
      <header className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Swiss & Italy 2026
            </h1>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mt-1">
              Family Trip • 16 Days
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg">
            A
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {Object.entries(currencyTotals).map(([currency, amount]) => (
            <div key={currency} className="flex-shrink-0 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex flex-col min-w-[80px]">
              <span className="text-[10px] text-gray-400 font-bold uppercase">{currency}</span>
              <span className="text-sm font-bold text-gray-700">
                {amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          ))}
          {Object.keys(currencyTotals).length === 0 && (
             <span className="text-xs text-gray-400">尚無花費紀錄</span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 max-w-lg mx-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 pb-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'schedule' ? 'text-blue-500' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="text-xl" />
            <span className="text-[10px] font-bold">行程</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'bookings' ? 'text-blue-500' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <FontAwesomeIcon icon={faPlane} className="text-xl" />
            <span className="text-[10px] font-bold">預訂</span>
          </button>

          <button 
            onClick={() => setActiveTab('expense')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'expense' ? 'text-blue-500' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <FontAwesomeIcon icon={faWallet} className="text-xl" />
            <span className="text-[10px] font-bold">花費</span>
          </button>

          <button 
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'journal' ? 'text-blue-500' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <FontAwesomeIcon icon={faBookOpen} className="text-xl" />
            <span className="text-[10px] font-bold">日記</span>
          </button>

          <button 
            onClick={() => setActiveTab('members')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'members' ? 'text-blue-500' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <FontAwesomeIcon icon={faUsers} className="text-xl" />
            <span className="text-[10px] font-bold">成員</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;