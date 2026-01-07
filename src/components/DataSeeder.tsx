// src/components/DataSeeder.tsx
import { useState } from 'react';
import { db } from '../firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { initialSchedule, initialBookings, initialExpenses, initialMembers, initialPosts } from '../data/mock';

export default function DataSeeder() {
  const [loading, setLoading] = useState(false);

  const uploadData = async () => {
    if (!confirm('確定要覆蓋雲端資料庫嗎？這將會上傳所有 Mock Data。')) return;
    setLoading(true);
    
    try {
      const batch = writeBatch(db);

      // 1. 上傳行程 (Schedule)
      initialSchedule.forEach((day) => {
        // 使用日期當作 ID，方便搜尋
        const docRef = doc(db, "schedules", day.date); 
        batch.set(docRef, day);
      });

      // 2. 上傳預訂 (Bookings)
      initialBookings.forEach((item) => {
        const docRef = doc(db, "bookings", item.id);
        batch.set(docRef, item);
      });

      // 3. 上傳支出 (Expenses)
      initialExpenses.forEach((item) => {
        const docRef = doc(db, "expenses", item.id);
        batch.set(docRef, item);
      });

      // 4. 上傳成員 (Members)
      initialMembers.forEach((item) => {
        const docRef = doc(db, "members", item.id);
        batch.set(docRef, item);
      });

      // 5. 上傳日誌 (Posts)
      initialPosts.forEach((item) => {
        const docRef = doc(db, "posts", item.id);
        batch.set(docRef, item);
      });

      await batch.commit();
      alert("資料庫初始化成功！(請記得之後移除此按鈕)");
    } catch (error) {
      console.error("上傳失敗:", error);
      alert("上傳失敗，請看 Console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      <button 
        onClick={uploadData} 
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-xl font-bold text-xs hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "上傳中..." : "🔥 初始化雲端資料"}
      </button>
    </div>
  );
}