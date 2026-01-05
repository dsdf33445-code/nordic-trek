import { useState } from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faBackspace } from '@fortawesome/free-solid-svg-icons';
import { Expense, CategoryType, CurrencyCode } from '../types';
import { initialMembers } from '../data/mock';
import { CategoryIcon } from '../components/Shared';
import { EXCHANGE_RATES, formatCurrency } from '../utils/helpers';

interface ExpenseViewProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

export default function ExpenseView({ expenses, setExpenses }: ExpenseViewProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCurrency, setNewExpenseCurrency] = useState<CurrencyCode>('ISK');
  const [newExpenseCategory, setNewExpenseCategory] = useState<CategoryType>('food');
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpensePayer, setNewExpensePayer] = useState("Me");

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

  const handleKeypadPress = (val: string) => {
    if (val === 'back') setNewExpenseAmount(prev => prev.slice(0, -1));
    else if (val === '.') { if (!newExpenseAmount.includes('.')) setNewExpenseAmount(prev => prev + val); }
    else if (newExpenseAmount.length < 8) setNewExpenseAmount(prev => prev + val);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-nordic-muted uppercase tracking-wider mb-2">最近支出</h3>
      {expenses.map((expense) => (
        <div key={expense.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-50">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${expense.currency === 'TWD' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'}`}><CategoryIcon type={expense.category} /></div>
          <div className="flex-1"><h4 className="font-bold text-nordic-text">{expense.title}</h4><div className="flex items-center gap-2 text-xs text-nordic-muted"><span>{expense.payer}</span><span>•</span><span>{expense.date}</span></div></div>
          <div className="text-right"><p className="font-bold text-lg">{formatCurrency(expense.amount, expense.currency)}</p>{expense.currency !== 'TWD' && <p className="text-xs text-nordic-muted">≈ {formatCurrency(expense.amount * EXCHANGE_RATES[expense.currency], 'TWD')}</p>}</div>
        </div>
      ))}

      <button onClick={() => setShowAddExpense(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-nordic-text text-white rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-90 transition-transform z-40"><FontAwesomeIcon icon={faPlus} /></button>

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
    </div>
  );
}