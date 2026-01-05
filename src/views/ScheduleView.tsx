import { useState, useMemo } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { initialSchedule } from '../data/mock';
import { WeatherIcon, CategoryIcon } from '../components/Shared';
import { TRIP_START_DATE, TRIP_END_DATE } from '../utils/helpers';

export default function ScheduleView() {
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-19");

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

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div className="flex overflow-x-auto space-x-3 no-scrollbar py-2 -mx-6 px-6">
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

      {/* Weather Widget */}
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

      {/* Timeline */}
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
  );
}