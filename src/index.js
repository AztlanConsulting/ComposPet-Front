import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './utilities/reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';  

const observer = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends observer {
    constructor(callback) {
        super((entries, observer) => {
            window.requestAnimationFrame(() => {
                if (!Array.isArray(entries) || !entries.length) return;
                callback(entries, observer);
            });
        });
    }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Reemplaza el texto de abajo con tu ID real de Google */}
    <GoogleOAuthProvider clientId="634332796349-8sjma9sdtc5s58c74a2nee682g31lsa8.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
/*reportWebVitals((metric) => {
  const metricData = {
    metric: metric.name,
    value: Number(metric.value.toFixed(2)),
    rating: metric.rating || 'No disponible',
    delta: Number(metric.delta.toFixed(2)),
    id: metric.id,
  };

  console.log(`[Web Vital] ${metric.name}:`, metricData);
});*/

reportWebVitals((metric) => {
  console.log(
    `[Web Vital] ${metric.name} | Valor: ${metric.value.toFixed(2)} ms | Delta: ${metric.delta.toFixed(2)}`
  );
});