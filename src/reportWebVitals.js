/** 
 * Inicializa la medición de métricas Web Vitals en la aplicación.
 * Esta función recibe un callback y lo ejecuta cada vez que la librería  
 * web-vitals reporta una métrica de rendimiento.
 * 
 * CLS, INP, FCP, LCP y TTFB
 * 
 * @param {Function} onPerfEntry - Función que procesa cada métrica reportada por web-vitals. 
 * */


const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getINP, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getINP(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;