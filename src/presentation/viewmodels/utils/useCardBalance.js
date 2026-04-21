import { useEffect, useState } from "react";

import { CardApiClient } from "../../../data/datasources/cardApiClient";
import { CardRepository } from "../../../data/repositories/cardRepository";
import { GetCardBalanceUseCase } from "../../../domain/useCases/getCardBalanceUseCase";

/**
 * Hook reutilizable para obtener el saldo de un cliente
 *
 * @returns {{ card: object|null, balance: num|null }} tarjeta y saldo del cliente.
 */
function useCardBalance(clientId){
    const [card, setCard] = useState(null);
   

    useEffect(() => {
        const getCardBalance = async () => {
            if(!clientId) return;
            try {
                const apiClient = new CardApiClient();
                const cardRepository = new CardRepository(apiClient);
                const getCardBalanceUseCase = new GetCardBalanceUseCase(cardRepository);

                // Ejecuta el caso de uso 
                const cardEntity = await getCardBalanceUseCase.execute(clientId);

                //Guarda la entidad en el estado
                setCard(cardEntity);
            } catch (error) {
                console.error('Error al obtener el saldo del cliente')
            }
        };

        if (clientId) {
            getCardBalance();
        }
    }, [clientId]);

    //Usa el método de la entidad para sacar el saldo; 
    const balance = card?.getCardBalance()|| null;

    return{
        card,
        balance,
    };
}

export default useCardBalance;