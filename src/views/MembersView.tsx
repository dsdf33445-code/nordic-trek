import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { Expense } from '../types';
import { initialMembers } from '../data/mock';
import { EXCHANGE_RATES, formatCurrency } from '../utils/helpers';

export default function MembersView({ expenses }: { expenses: Expense[] }) {
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

  return (
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
                  <div className="h-full bg-nordic-primary rounded-full transition-all duration-500" style={{ width: (amount / (memberSpending[0][1] || 1)) * 100 + '%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}