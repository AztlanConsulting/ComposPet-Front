/**
 * Initializes the collection of Web Vitals metrics for the application.
 *
 * This function receives a callback and sends each reported metric to it.
 * The metrics collected include loading, visual stability and interaction
 * performance indicators such as CLS, FID, FCP, LCP and TTFB.
 *
 * @param {Function} onPerfEntry - Callback function used to handle each reported Web Vitals metric.
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