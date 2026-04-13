/**
 * Entidad de dominio que representa a un cliente.
 * Encapsula los datos del cliente y expone métodos para consultar
 * su información sin exponer la lógica de manipulación al exterior.
 */
export class Client {
    /**
     * @param {object} params - Datos del cliente provenientes del repositorio.
     * @param {string} params.idCliente - Identificador único del cliente.
     * @param {string} params.idUsuario - Identificador único del usuario asociado.
     * @param {number|null} params.idRuta - Identificador de la ruta asignada.
     * @param {string|null} params.mascotas - Información de mascotas del cliente.
     * @param {number|null} params.cantidadFamilia - Cantidad de integrantes de la familia.
     * @param {string|null} params.direccion - Dirección registrada del cliente.
     * @param {number|null} params.ordenHorario - Orden del horario asignado.
     * @param {string|null} params.notas - Notas adicionales del cliente.
     * @param {string|Date|null} params.fechaEntrada - Fecha de entrada del cliente.
     * @param {string|Date|null} params.fechaSalida - Fecha de salida del cliente.
     */
    constructor({
        idCliente,
        idUsuario,
        idRuta,
        mascotas,
        cantidadFamilia,
        direccion,
        ordenHorario,
        notas,
        fechaEntrada,
        fechaSalida,
    }) {
        this.idCliente = idCliente;
        this.idUsuario = idUsuario;
        this.idRuta = idRuta;
        this.mascotas = mascotas;
        this.cantidadFamilia = cantidadFamilia;
        this.direccion = direccion;
        this.ordenHorario = ordenHorario;
        this.notas = notas;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
    }
    /**
     * Retorna el identificador único del cliente.
     *
     * @returns {string} Id del cliente.
     */
    obtenerIdCliente() {
        return this.idCliente;
    }
}