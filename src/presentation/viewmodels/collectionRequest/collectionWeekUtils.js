const WEEK_DAYS_INDEX = {
    domingo: 0, lunes: 1, martes: 2, miercoles: 3,
    jueves: 4, viernes: 5, sabado: 6,
};

/**
 * Calcula el lunes de la semana de recolección (Sábado-Viernes) a la que
 * pertenece una fecha dada. Replica el mismo criterio de agrupación que
 * usa la tabla de rutas en backend (Route.getCollectionWeekMonday).
 *
 * Nota: esta función recibe la fecha ACTUAL del cliente (el día en que
 * entra al formulario), que puede caer en cualquier día de la semana,
 * incluidos sábado y domingo — aunque no existan rutas en esos días.
 *
 * @param {Date} date - Fecha a evaluar.
 * @returns {Date} Lunes (hora local, medianoche) de la semana de recolección correspondiente.
 */
function getCollectionWeekMonday(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dow = d.getDay();

    if (dow === 6) { // Sábado -> semana siguiente
        d.setDate(d.getDate() + 2);
        return d;
    }
    if (dow === 0) { // Domingo -> semana siguiente
        d.setDate(d.getDate() + 1);
        return d;
    }
    // Lunes a Viernes: retrocede al lunes de esa misma semana
    d.setDate(d.getDate() - (dow - 1));
    return d;
}

/**
 * Convierte una fecha a formato YYYY-MM-DD usando sus componentes locales,
 * sin pasar por conversión a UTC (a diferencia de toISOString()).
 *
 * @param {Date} date - Fecha a formatear.
 * @returns {string} Fecha en formato YYYY-MM-DD.
 */
function toDateOnlyString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Calcula el rango de la semana de recolección actual (Sábado a Viernes),
 * usando el mismo criterio que la tabla de rutas. Devuelve fechas en
 * formato YYYY-MM-DD (sin hora) para evitar desfases de zona horaria
 * al convertir a UTC.
 *
 * @param {Date} [currentDate=new Date()] - Fecha de referencia (inyectable para pruebas).
 * @returns {{ weekStartDate: string, weekEndDate: string }}
 */
function calculateCurrentWeekRange(currentDate = new Date()) {
    const monday = getCollectionWeekMonday(currentDate);

    const weekStartDate = new Date(monday);
    weekStartDate.setDate(weekStartDate.getDate() - 2); // Sábado

    const weekEndDate = new Date(monday);
    weekEndDate.setDate(weekEndDate.getDate() + 4); // Viernes

    return {
        weekStartDate: toDateOnlyString(weekStartDate),
        weekEndDate: toDateOnlyString(weekEndDate),
    };
}

/**
 * Desplazamiento en días, respecto al lunes de la semana de recolección,
 * para cada día de ruta soportado. Solo Lunes-Viernes: ComposPet no tiene
 * rutas en sábado ni domingo, así que esos casos no se incluyen aquí
 * deliberadamente (ver theClientIsInTime para el manejo explícito de un
 * routeDay no soportado).
 */
const ROUTE_DAY_OFFSET_FROM_MONDAY = {
    1: 0,  // Lunes
    2: 1,  // Martes
    3: 2,  // Miércoles
    4: 3,  // Jueves
    5: 4,  // Viernes
};

/**
 * Determina si el cliente está dentro del horario permitido para generar
 * una solicitud de recolección, considerando su día de ruta.
 *
 * La semana de recolección va de Sábado a Viernes. El acceso se abre al
 * inicio de esa semana (Sábado 00:00) y se cierra un día antes del día
 * de ruta del cliente, a las 6:00 PM.
 *
 * Nota: no es necesario proyectar a la semana siguiente cuando el corte
 * ya pasó. getCollectionWeekMonday(currentDate) siempre calcula la
 * semana que CONTIENE a currentDate, así que el inicio de esa semana
 * (Sábado) nunca es una fecha futura respecto a currentDate — por
 * construcción, currentDate siempre cae dentro de la ventana de "esta"
 * semana o después de su corte. El acceso para la semana siguiente se
 * abre naturalmente cuando currentDate llegue al próximo Sábado, sin
 * necesidad de ningún cálculo adicional aquí.
 *
 * @param {number} routeDayNumber - Número de día de ruta (1=Lunes...5=Viernes).
 * Debe resolver a Lunes-Viernes; no existen rutas sábado ni domingo en el sistema.
 * @param {Date} [currentDate=new Date()] - Fecha/hora de referencia (inyectable para pruebas).
 * @returns {boolean} true si el cliente puede acceder al formulario ahora.
 */
function theClientIsInTime(routeDayNumber, currentDate = new Date()) {
    const offset = ROUTE_DAY_OFFSET_FROM_MONDAY[routeDayNumber];

    if (offset === undefined) {
        console.error(`theClientIsInTime: día de ruta no soportado (routeDayNumber=${routeDayNumber}). Solo se soportan Lunes-Viernes.`);
        return false;
    }

    const monday = getCollectionWeekMonday(currentDate);

    const routeDate = new Date(monday);
    routeDate.setDate(routeDate.getDate() + offset);
    routeDate.setHours(0, 0, 0, 0);

    const limitDate = new Date(routeDate);
    limitDate.setDate(limitDate.getDate() - 1);
    limitDate.setHours(18, 0, 0, 0);

    return currentDate <= limitDate;
}

module.exports = {
    getCollectionWeekMonday,
    toDateOnlyString,
    calculateCurrentWeekRange,
    ROUTE_DAY_OFFSET_FROM_MONDAY,
    theClientIsInTime,
};