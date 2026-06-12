export class GetAdminProfileUseCase {
    constructor(adminProfileRepository){
        this.adminProfileRepository = adminProfileRepository;
    }

    async execute(){
        return await this.adminProfileRepository.getProfileInformation();
    }
}