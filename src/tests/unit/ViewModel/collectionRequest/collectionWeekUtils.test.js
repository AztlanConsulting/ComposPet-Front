const {
    getCollectionWeekMonday,
    calculateCurrentWeekRange,
    theClientIsInTime,
} = require('../../../../presentation/viewmodels/collectionRequest/collectionWeekUtils');

describe('getCollectionWeekMonday', () => {
    // Semana de referencia: Sábado 19-Sep-2026 a Viernes 25-Sep-2026 (lunes clave: 21-Sep)
    const MONDAY_KEY = new Date(2026, 8, 21);

    it('Sábado pertenece a la semana que empieza ese mismo día (regresa el lunes siguiente)', () => {
        expect(getCollectionWeekMonday(new Date(2026, 8, 19))).toEqual(MONDAY_KEY);
    });

    it('Domingo pertenece a la misma semana que el sábado anterior', () => {
        expect(getCollectionWeekMonday(new Date(2026, 8, 20))).toEqual(MONDAY_KEY);
    });

    it('Lunes regresa el lunes de su propia semana', () => {
        expect(getCollectionWeekMonday(new Date(2026, 8, 21))).toEqual(MONDAY_KEY);
    });

    it('Viernes regresa al lunes de esa misma semana', () => {
        expect(getCollectionWeekMonday(new Date(2026, 8, 25))).toEqual(MONDAY_KEY);
    });

    it('El sábado siguiente ya pertenece a la semana nueva (lunes +7)', () => {
        const nextMonday = new Date(2026, 8, 28);
        expect(getCollectionWeekMonday(new Date(2026, 8, 26))).toEqual(nextMonday);
    });
});

describe('calculateCurrentWeekRange', () => {
    it('Si hoy es sábado, regresa sábado-viernes de la semana de recolección correcta', () => {
        const result = calculateCurrentWeekRange(new Date(2026, 8, 19)); // Sábado
        expect(result).toEqual({
            weekStartDate: '2026-09-19',
            weekEndDate: '2026-09-25',
        });
    });

    it('Si hoy es domingo, agrupa en la misma semana que el sábado anterior', () => {
        const result = calculateCurrentWeekRange(new Date(2026, 8, 20)); // Domingo
        expect(result).toEqual({
            weekStartDate: '2026-09-19',
            weekEndDate: '2026-09-25',
        });
    });

    it('Si hoy es lunes, regresa el sábado anterior como inicio', () => {
        const result = calculateCurrentWeekRange(new Date(2026, 8, 21)); // Lunes
        expect(result.weekStartDate).toBe('2026-09-19');
    });

    it('Si hoy es viernes, regresa el viernes actual como fin', () => {
        const result = calculateCurrentWeekRange(new Date(2026, 8, 25)); // Viernes
        expect(result.weekEndDate).toBe('2026-09-25');
    });
});

describe('theClientIsInTime', () => {
    const LUNES = 1, MARTES = 2, MIERCOLES = 3, JUEVES = 4, VIERNES = 5;

    it('Cliente con ruta lunes: acceso sábado/domingo permitido', () => {
        expect(theClientIsInTime(LUNES, new Date(2026, 8, 19, 10, 0))).toBe(true); // Sábado
        expect(theClientIsInTime(LUNES, new Date(2026, 8, 20, 10, 0))).toBe(true); // Domingo
    });

    it('Cliente con ruta lunes: domingo después de 6 PM queda bloqueado', () => {
        expect(theClientIsInTime(LUNES, new Date(2026, 8, 20, 19, 0))).toBe(false);
    });

    it('Cliente con ruta martes: acceso sábado-domingo-lunes antes de 6 PM permitido', () => {
        expect(theClientIsInTime(MARTES, new Date(2026, 8, 19, 10, 0))).toBe(true); // Sábado
        expect(theClientIsInTime(MARTES, new Date(2026, 8, 21, 17, 59))).toBe(true); // Lunes 17:59
        expect(theClientIsInTime(MARTES, new Date(2026, 8, 21, 18, 1))).toBe(false); // Lunes 18:01
    });

    it('Cliente con ruta viernes: acceso desde sábado hasta jueves 6 PM', () => {
        expect(theClientIsInTime(VIERNES, new Date(2026, 8, 19, 10, 0))).toBe(true); // Sábado
        expect(theClientIsInTime(VIERNES, new Date(2026, 8, 24, 17, 59))).toBe(true); // Jueves 17:59
        expect(theClientIsInTime(VIERNES, new Date(2026, 8, 24, 18, 1))).toBe(false); // Jueves 18:01
    });

    it('Si el corte de esta semana ya pasó, el acceso permanece cerrado hasta el próximo Sábado', () => {
    // Ruta lunes, hoy miércoles -> el corte de esta semana (domingo 6pm)
    // ya pasó. No debe haber acceso hasta que inicie la ventana de la
    // semana siguiente (el próximo sábado), no antes.
    expect(theClientIsInTime(LUNES, new Date(2026, 8, 23, 12, 0))).toBe(false);
    });

    it('El acceso se reabre exactamente el Sábado siguiente a las 00:00', () => {
        // Ruta lunes: el sábado 26-sep es el inicio de la ventana de la
        // semana siguiente (lunes de ruta 28-sep).
        expect(theClientIsInTime(LUNES, new Date(2026, 8, 26, 0, 0))).toBe(true);
    });

    it('Día de ruta no soportado (ej. sábado/domingo) siempre retorna false', () => {
        expect(theClientIsInTime(6, new Date(2026, 8, 19, 10, 0))).toBe(false); // Sábado
        expect(theClientIsInTime(0, new Date(2026, 8, 19, 10, 0))).toBe(false); // Domingo
    });
});