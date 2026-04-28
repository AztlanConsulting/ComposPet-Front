export class NewClient {
    constructor({
        userId,
        clientId,
        email,
        credit
    }) {
        this.userId = userId;
        this.clientId = clientId;
        this.email = email;
        this.credit = credit;
    }
}