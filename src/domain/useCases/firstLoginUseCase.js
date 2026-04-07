export class FirstLoginUseCase{

    constructor(firstLoginRepository) {
        this.repository = firstLoginRepository;
    }

    async executeRequest(email) {
        if (!email.includes('@')) throw new Error("Email inválido");
        return await this.repository.requestOTP(email);
    }

    async executeVerify(email, code, seedToken) {
        if (code.length !== 6) throw new Error("El código debe ser de 6 dígitos");
        return await this.repository.verifyOTP(email, code, seedToken);
    }

    async executeFinalize(email, password, confirmPassword,  flowToken) {
        if (password !== confirmPassword) throw new Error("MATCH_ERROR");
        if (password.length < 8) throw new Error("La contraseña es muy corta");
        return await this.repository.updatePassword(email, password, flowToken);
    }
}