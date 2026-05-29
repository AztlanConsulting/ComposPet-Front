/**
* Inicializa la recopilación de métricas de Web Vitals para la aplicación.
*
* Esta función recibe una función de devolución de llamada y le envía cada métrica reportada.
* Las métricas recopiladas incluyen indicadores de rendimiento de carga, estabilidad visual e interacción,
* como CLS, INP, FCP, LCP y TTFB.
*
* @param {Function} onPerfEntry - Función de devolución de llamada utilizada para gestionar cada métrica de Web Vitals reportada.
*/
const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
            onCLS(onPerfEntry);
            onINP(onPerfEntry);
            onFCP(onPerfEntry);
            onLCP(onPerfEntry);
            onTTFB(onPerfEntry);
        });
    }
};

export default reportWebVitals;