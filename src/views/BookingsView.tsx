import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPassport, faUnlock, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CategoryIcon } from '../components/Shared';
import { PIN_CODE } from '../utils/helpers';
import type { Booking } from '../types';

interface BookingsViewProps {
  bookings: Booking[];
}

export default function BookingsView({ bookings }: BookingsViewProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");

  const handleUnlock = () => {
    if (pinInput === PIN_CODE) { setIsUnlocked(true); setShowPinModal(false); setPinInput(""); } 
    else { alert("密碼錯誤 (提示: 0829)"); setPinInput(""); }
  };

  return (
    <div className="space-y-6">
      {/* Header Action */}
      <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100 mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-800"><FontAwesomeIcon icon={faPassport} /><span>我的憑證</span></div>
        <button onClick={() => isUnlocked ? setIsUnlocked(false) : setShowPinModal(true)} className={`text-sm font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-2 ${isUnlocked ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}><FontAwesomeIcon icon={isUnlocked ? faUnlock : faLock} />{isUnlocked ? '已解鎖' : '隱私保護'}</button>
      </div>

      {/* Cards */}
      {bookings.map((booking) => (
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

      {/* PIN Modal */}
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
    </div>
  );
}