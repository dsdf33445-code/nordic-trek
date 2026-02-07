import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// [新增] 引入登入功能
import { signInAnonymously } from "firebase/auth";
import { auth } from "./firebase";

// [新增] 執行匿名登入
signInAnonymously(auth)
  .then(() => {
    console.log("匿名登入成功，現在可以讀取資料庫了");
  })
  .catch((error) => {
    console.error("匿名登入失敗:", error);
  });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)