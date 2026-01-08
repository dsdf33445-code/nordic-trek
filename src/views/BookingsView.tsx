import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faBed, faMapSigns, faLink } from '@fortawesome/free-solid-svg-icons';
import { CategoryIcon } from '../components/Shared';
import type { Booking } from '../types';

interface BookingsViewProps {
  bookings: Booking[];
}

type TabType = 'transport' | 'stay' | 'activity';

export default function BookingsView({ bookings }: BookingsViewProps) {
  // 僅保留分頁狀態
  const [activeTab, setActiveTab] = useState<TabType>('transport');

  const filteredBookings = bookings.filter(booking => {
    const type = booking.type || 'other';
    if (activeTab === 'transport') return ['flight', 'car', 'transport'].includes(type);
    if (activeTab === 'stay') return type === 'stay';
    if (activeTab === 'activity') return type === 'activity';
    return false;
  });

  return (
    <div className="space-y-4">
      {/* Header: Tabs Only */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex-1">
          <button 
            onClick={() => setActiveTab('transport')} 
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${activeTab === 'transport' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FontAwesomeIcon icon={faCar} /> 交通
          </button>
          <button 
            onClick={() => setActiveTab('stay')} 
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${activeTab === 'stay' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FontAwesomeIcon icon={faBed} /> 住宿
          </button>
          <button 
            onClick={() => setActiveTab('activity')} 
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${activeTab === 'activity' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FontAwesomeIcon icon={faMapSigns} /> 行程
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4 min-h-[300px]">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-100 animate-fade-in">
              <div className={`p-4 flex justify-between items-center text-white ${
                booking.type === 'flight' ? 'bg-blue-500' : 
                booking.type === 'car' ? 'bg-slate-700' : 
                booking.type === 'stay' ? 'bg-indigo-500' :
                booking.type === 'activity' ? 'bg-emerald-500' : // [Fix] 明確加入 activity 顏色
                'bg-emerald-500'
              }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <CategoryIcon type={booking.type || 'other'} className="text-white"/>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{booking.title || '未命名預訂'}</h3>
                      <p className="text-xs opacity-80 font-mono">{booking.subtitle || ''}</p>
                    </div>
                  </div>
                  
                  {/* Link Button */}
                  {booking.link && (
                    <a 
                      href={booking.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <FontAwesomeIcon icon={faLink} className="text-sm" />
                    </a>
                  )}
              </div>

              <div className="p-5 relative">
                  {booking.type === 'flight' && <div className="absolute top-0 left-0 w-full -translate-y-1/2 flex items-center justify-between px-2"><div className="w-4 h-4 bg-nordic-bg rounded-full"></div><div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2"></div><div className="w-4 h-4 bg-nordic-bg rounded-full"></div></div>}
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
                    {(booking.details || []).map((detail, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-nordic-muted uppercase tracking-wider font-bold mb-1">{detail.label}</p>
                        <p className="text-sm font-semibold text-nordic-text">{detail.value}</p>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              <FontAwesomeIcon icon={activeTab === 'transport' ? faCar : activeTab === 'stay' ? faBed : faMapSigns} className="text-2xl" />
            </div>
            <p className="text-sm font-bold">尚無{activeTab === 'transport' ? '交通' : activeTab === 'stay' ? '住宿' : '行程'}預訂資料</p>
          </div>
        )}
      </div>
    </div>
  );
}