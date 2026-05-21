/**
 * Caso de uso para obtener el url de google sheets.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see RoutesIRepository
 */

export class GenerateRouteMessagesUseCase {
        /**
     * Crea una instancia del caso de uso para obtener el url de google sheets.
     *
     * @param {import('../repositoriesroutesInfo/routesInterfaceRepository').RoutesIRepository} routesRepository - Implementación del repositorio de rutas.
     */
    constructor(routesRepository) {
        this.routesRepository = routesRepository;
    }

    /**
     * Ejecuta la generación de mensajes de confirmación.
     *
     * @async
     * @param {number} weekIndex - Índice de la semana seleccionada.
     * @param {string} dayName - Día de ruta seleccionado.
     * @returns {Promise<Object>} Resultado de la generación de mensajes y URL del archivo.
     * @throws {Error} Lanza un error si falta la semana seleccionada o si el repositorio falla.
     */
    async execute(weekIndex, dayName) {

        if (weekIndex === null || weekIndex === undefined || !dayName) {
            throw new Error("Faltan datos para generar los mensajes de confirmación");
        }

        return await this.routesRepository.generateConfirmationMessages(
            weekIndex,
            dayName
        );
    }
}