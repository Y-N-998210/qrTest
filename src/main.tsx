import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// async function enableMocking() {
  // 開発環境（npm run dev）のときだけ MSW を起動
  // if (import.meta.env.DEV) {
  //   const { worker } = await import('./mocks/browser')
  //   return worker.start({
  //     onUnhandledRequest: 'bypass', // ハンドラーがないリクエストはエラーにせずスルー
  //   })
  // }

  // Vercelに上げるときはこっち使う
  // const { worker } = await import('./mocks/browser');
  // return worker.start({
  //   onUnhandledRequest: 'bypass',
  // });
// }

// MSWの準備（または本番環境でのスキップ）が完了してからアプリをレンダリング
// enableMocking().then(() => {
//   createRoot(document.getElementById('root')!).render(
//     <StrictMode>
//       <App />
//     </StrictMode>,
//   );
// });



// MSWを起動せず、直接アプリを起動
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);