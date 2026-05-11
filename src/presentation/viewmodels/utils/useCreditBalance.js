import { useEffect, useState } from "react";

import { CreditApiClient } from "../../../data/datasources/creditApiClient";
import { CreditRepository } from "../../../data/repositories/creditRepository";
import { GetCreditBalanceUseCase } from "../../../domain/useCases/getCreditBalanceUseCase";

/**
 * Hook reutilizable para obtener el saldo de un cliente
 *
 * @returns {{ 
 *  credit: object|null, 
 *  balance: num|null
 *  loading: boolean,
 *  error: Error|null
 * }}saldo del cliente.
 */
function useCreditBalance(clientId){
    const [credit, setCredit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const getCreditBalance = async () => {
            if(!clientId){
                setError("No pudimos identificar tu sesión. Inicia sesión nuevamente.");
                setLoading(false);
                return;
            } 
            try {

                setLoading(true);
                setError(null);

                const apiClient = new CreditApiClient();
                const creditRepository = new CreditRepository(apiClient);
                const getCreditBalanceUseCase = new GetCreditBalanceUseCase(creditRepository);

                // Ejecuta el caso de uso 
                const creditEntity = await getCreditBalanceUseCase.execute(clientId);

                //Guarda la entidad en el estado
                setCredit(creditEntity);
            } catch (error) {
                console.error('Error al obtener el saldo del cliente')
                setError("No pudimos cargar tu saldo. Intenta nuevamente más tarde.");
            } finally {
                setLoading(false);
            }
        };

        getCreditBalance();
        
    }, [clientId]);

    //Usa el método de la entidad para sacar el saldo; 
    const balance = credit?.getCreditBalance()|| null;

    return{
        credit,
        balance,
        loading,
        error,
    };
}

export default useCreditBalance;