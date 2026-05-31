import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './utilities/reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { reportWebVitalApiClient } from './data/datasources/reportWebVitalsApiClient';
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

const webVitalApiClient = new reportWebVitalApiClient();

/**

* Informa las métricas de Web Vitals 
*
* Las métricas relacionadas con la carga de la página se muestran en segundos, 
* mientras que el INP se muestra en milisegundos, ya que mide el tiempo de respuesta de la interacción.
*
* @param {Object} metric - Métrica de Web Vitals informada por la biblioteca.
* @param {string} metric.name - Nombre de la métrica, como FCP, LCP, TTFB, CLS o INP.
* @param {number} metric.value - Valor actual de la métrica informada.
* @param {number} metric.delta - Diferencia entre el valor actual y el anterior de la métrica.
*/

reportWebVitals((metric) => {
  const shouldDisplayInMilliseconds = metric.name === 'INP' || metric.name === 'FID';

  const value = shouldDisplayInMilliseconds
    ? Number(metric.value.toFixed(2))
    : Number((metric.value / 1000).toFixed(2));

  const delta = shouldDisplayInMilliseconds
    ? Number(metric.delta.toFixed(2))
    : Number((metric.delta / 1000).toFixed(2));

  const unit = shouldDisplayInMilliseconds ? 'ms' : 's';

  const metricData = {
    name: metric.name,
    value,
    delta,
    unit,
    id: metric.id,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };

  webVitalApiClient.sendWebVitalMetric(metricData);
});