import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginUseCase } from "../../../domain/useCases/loginUseCase";
import { AuthRepository } from "../../../data/repositories/authRepository";
import { AuthApiClient } from "../../../data/datasources/authApiClient";

function useLoginViewModel(){

    const navigate = useNavigate();

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[errors, setErrors] = useState({ email: "", password: "", general: "" });
    const[loading, setLoading] = useState(false);

    const onSubmit = async (e) =>{
        e.preventDefault();
        setErrors({ email: "", password: "", general: "" });
        setLoading(true);

        try{

            const apiClient    = new AuthApiClient();
            const authRepo     = new AuthRepository(apiClient);
            const loginUseCase = new LoginUseCase(authRepo);

            const user = await loginUseCase.execute(email, password);

            sessionStorage.setItem("token", user.token);

            if(user.isAdmin()){
                navigate("/dashboard");
            } else if (user.isFirstLogin()){
                navigate("/");
            } else {
                navigate("/");
            }
        } catch (err) {
            const msg = err.message;
            if (msg.includes("correo")) {
                setErrors({ email: msg, password: "", general: "" });
            } else if (msg.includes("contraseña") || msg.includes("Credenciales")) {
                setErrors({ email: "", password: msg, general: "" });
            } else {
                setErrors({ email: "", password: "", general: msg });
            }
        } finally {
            setLoading(false);
        }
    };

    return{
        email,
        password,
        errors,
        loading,

        setEmail,
        setPassword,

        onSubmit,
    };
}

export default useLoginViewModel;