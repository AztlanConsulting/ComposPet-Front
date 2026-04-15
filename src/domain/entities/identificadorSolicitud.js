export class IdentificadorSolicitud {
    constructor(data) {
        if (typeof data === 'string') {
            this.idSolicitud = data;
        } else {
            this.idSolicitud = data.idSolicitud || data.id_solicitud;
        }
    }
}