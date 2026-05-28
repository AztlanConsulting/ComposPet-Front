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


/**
 * Reports Web Vitals metrics in the browser console to support frontend
 * performance monitoring during development and validation.
 *
 * Metrics related to page loading are displayed in seconds, while INP is
 * displayed in milliseconds because it measures interaction response time.
 *
 * @param {Object} metric - Web Vitals metric reported by the library.
 * @param {string} metric.name - Name of the metric, such as FCP, LCP, TTFB, CLS or INP.
 * @param {number} metric.value - Current value of the reported metric.
 * @param {number} metric.delta - Difference between the current and previous metric value.
 */

reportWebVitals((metric) => {
  const shouldDisplayInMilliseconds = metric.name === 'INP';

  const value = shouldDisplayInMilliseconds
    ? metric.value.toFixed(2)
    : (metric.value / 1000).toFixed(2);

  const delta = shouldDisplayInMilliseconds
    ? metric.delta.toFixed(2)
    : (metric.delta / 1000).toFixed(2);

  const unit = shouldDisplayInMilliseconds ? 'ms' : 's';

  console.log(
    `[Web Vital] ${metric.name} | Valor: ${value} ${unit} | Delta: ${delta} ${unit}`
  );
});