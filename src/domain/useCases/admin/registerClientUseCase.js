export class RegisterClient {
    constructor(registerClientRepository){
        this.registerClientRepository = registerClientRepository;
    }

    async execute(data){
        const clientData = {
            name: data.name,
            lastName: `${data.lastname1} ${data.lastname2}`.trim(),
            email: data.email,
            phone: data.phone,
            pets: data.pets,
            family: data.family,
            notes: data.notes,
            address: data.address,
            id_ruta: data.selectedDay,
        };

        const registerClient = await this.registerClientRepository.postRegisterClient(clientData);
        return registerClient;
    }
}