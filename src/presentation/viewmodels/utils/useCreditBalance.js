import { useEffect, useState } from "react";

import { CreditApiClient } from "../../../data/datasources/creditApiClient";
import { CreditRepository } from "../../../data/repositories/creditRepository";
import { GetCreditBalanceUseCase } from "../../../domain/useCases/getCreditBalanceUseCase";

/**
 * Hook reutilizable para obtener el saldo de un cliente
 *
 * @returns {{ credit: object|null, balance: num|null }} tarjeta y saldo del cliente.
 */
function useCreditBalance(clientId){
    const [credit, setCredit] = useState(null);


    useEffect(() => {
        const getCreditBalance = async () => {
            if(!clientId) return;
            try {
                const apiClient = new CreditApiClient();
                const creditRepository = new CreditRepository(apiClient);
                const getCreditBalanceUseCase = new GetCreditBalanceUseCase(creditRepository);

                // Ejecuta el caso de uso 
                const creditEntity = await getCreditBalanceUseCase.execute(clientId);

                //Guarda la entidad en el estado
                setCredit(creditEntity);
            } catch (error) {
                console.error('Error al obtener el saldo del cliente')
            }
        };

        if (clientId) {
            getCreditBalance();
        }
    }, [clientId]);

    //Usa el método de la entidad para sacar el saldo; 
    const balance = credit?.getCreditBalance()|| null;

    return{
        credit,
        balance,
    };
}

export default useCreditBalance;