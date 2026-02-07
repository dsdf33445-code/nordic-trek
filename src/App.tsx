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

  // --- [Fix] 自動計算所有幣別的總額 (不再寫死 totalISK, totalNOK...) ---
  const currencyTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    initialExpenses.forEach(item => {
      const currency = item.currency;
      if (totals[currency] !== undefined) {
        totals[currency] += item.amount;
      } else {
        totals[currency] = item.amount;
      }
    });

    return totals;
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <ScheduleView schedules={initialSchedule} />;
      case 'bookings':
        return <BookingsView bookings={initialBookings} />;
      case 'expense':
        return <ExpenseView expenses={initialExpenses} />;
      case 'journal':
        return <JournalView posts={initialPosts} />;
      case 'members':
        return <MembersView members={initialMembers} />;
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

        {/* Quick Stats (動態顯示：有什麼幣別就顯示什麼) */}
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