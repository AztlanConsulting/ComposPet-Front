import { useEffect, useState } from "react";

import { CardApiClient } from "../../../data/datasources/cardApiClient";
import { CardRepository } from "../../../data/repositories/cardRepository";
import { GetCardBalnceUseCase } from "../../../domain/useCases/getCardBalanceUseCase";
import { ClientRepository } from "../../../data/repositories/clientRepository";

/**
 * Hook reutilizable para obtener el saldo de un cliente
 *
 * @returns {{ card: object|null, balance: num|null }} tarjeta y saldo del cliente.
 */
function useCardBalance(clientId){
    const {card, setCard} = useState(null);
   

    useEffect(() => {
        const getCardBalance = async () => {
            if(!clientId) return;
            try {
                const apiClient = new CardApiClient();
                const cardRepository = new CardRepository(apiClient);
                const getCardBalanceUseCase = new GetCardBalnceUseCase(cardRepository);

                const cardEntity = await getCardBalanceUseCase.execute(clientId);

                setCard(cardEntity);
            } catch (error) {
                console.error('Error al obtener el saldo del cliente')
            }
        };

        if (clientId) {
            getCardBalance();
        }
    }, [clientId]);

    const balance = balance?.getCardBalance()|| null;

    return{
        card,
        balance,
    };
}

export default useCardBalance;