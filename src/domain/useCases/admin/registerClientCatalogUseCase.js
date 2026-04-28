export class RegisterClientCatalog {
    constructor(registerClientRepository){
        this.registerClientRepository = registerClientRepository;
    }

    async execute(){
        const registerCatalog = await this.registerClientRepository.getRegisterClient();
        return registerCatalog;
    }
}