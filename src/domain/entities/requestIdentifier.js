export class RequestIdentifier {
    constructor(data) {
        if (typeof data === 'string') {
            this.idRequest = data;
        } else {
            this.idRequest = data.id_solicitud;
        }
    }
}