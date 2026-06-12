export class GetAdminProfileUseCase {
    constructor(adminProfileRepository){
        this.adminProfileRepository = adminProfileRepository;
    }

    async execute(){
        return await this.adminProfileRepository.getProfileInformation();
    }
}
export class UpdateAdminProfileUseCase {
    constructor(adminProfileRepository){
        this.adminProfileRepository = adminProfileRepository;
    }

    async execute(data){
        return await this.adminProfileRepository.updateProfileInformation(data);
    }
}