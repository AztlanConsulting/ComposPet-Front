import {useEffect, useState, useMemo} from "react";
import {GetCollectionSummaryUseCase} from "../../../domain/useCases/getCollectionSummaryUseCase";
import {DeleteProductSummaryUseCase} from "../../../domain/useCases/deleteProductSummaryUseCase";
import { UpdateCollectionTotalUseCase } from "../../../domain/useCases/updateCollectionTotalUseCase";
import { CollectionSummaryRepositoryImpl } from "../../../data/repositories/collectionSummaryRepository";
import { CollectionRequestApiClient } from "../../../data/datasources/collectionRequestApiClient";

/**
 * ViewModel de la tercera sección del formulario de recolección (FORM-07).
 * Maneja la lógica del final del formulario, recopila el resumen de la solicitud
 * de recolección.
 *
 * @param {string} clientId - Id del cliente autenticado en formato UUID.
 * @param {string} weekStartDate - Fecha inicial del rango semanal.
 * @param {string} weekEndDate - Fecha final del rango semanal.
 * @returns {Object} Estado y acciones del step 3.
 */
function useCollectionRequestThirdSectionViewModel(idClient, weekStartDate, weekEndDate) {

    const [collection, setCollection] = useState({});
    const [products, setProducts] = useState([]);
    const [balance, setBalance] = useState(0);
    const [collectionTotal, setCollectionTotal] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [bucketCost, setBucketCost] = useState(null);

    const [loading, setLoading] = useState(false);
    const [paymentAviable, setPaymentAviable] = useState([]); 
    const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(0);
    const [notes, setNotes] = useState('');

    const useCase = useMemo(() => {
        const datasource = new CollectionRequestApiClient();
        const repository = new CollectionSummaryRepositoryImpl(datasource);
        return new GetCollectionSummaryUseCase(repository);
    }, []);

    const deleteUseCase = useMemo(() => {
        const datasource = new CollectionRequestApiClient();
        const repository = new CollectionSummaryRepositoryImpl(datasource);
        return new DeleteProductSummaryUseCase(repository);
    }, []);

    const updateCollectionTotalUseCase = useMemo(() => {
        const datasource = new CollectionRequestApiClient();
        const repository = new CollectionSummaryRepositoryImpl(datasource);
        return new UpdateCollectionTotalUseCase(repository);
    })

    useEffect(() => {
        if(idClient) {
            loadSummary();
        }
    }, [idClient]);

    const loadSummary = async () => {
        try {
            setLoading(true);

            const response = await useCase.execute(
                idClient,
                weekStartDate,
                weekEndDate
            );
            
            setCollection(response.collection);
            setProducts(response.products);
            setBalance(response.balance);
            setCollectionTotal(response.total);
            setPaymentMethods(response.payMethods);
            setNotes(response.collection.notes);
            setBucketCost(response.bucketCost);
            const aviableMethods = response.payMethods.map((method) => {
                if (
                    method.tipo === "Saldo" &&
                    response.balance < response.total
                ) {
                    return false;
                }
                return true;
            });

            setPaymentAviable(aviableMethods);

        }
        catch(error) {
            console.log("Error loading summary: ", error);
        }
        finally {
            setLoading(false);
        }
    };

    const removeProduct = async(idProduct, idRequest, quantity) => {
        try {
            setLoading(true);

            await deleteUseCase.execute(idProduct, idRequest, quantity);

            await loadSummary();
        }
        catch (error) {
            console.log("Error deleting product", error);
        }
        finally {
            setLoading(false);
        }
    }

    const saveThirdSection = async () => {
        try {
            setLoading(true);

            await updateCollectionTotalUseCase.execute(
                collection.id_solicitud,
                collectionTotal,
                paymentMethods[selectedPaymentIndex].id_pago,
                notes,
            );

            return {
                success: true,
                nextStep: 4,
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    return {
        collection,
        products,
        balance,
        collectionTotal,
        paymentMethods,
        paymentAviable,
        loading,

        selectedPaymentIndex,
        setSelectedPaymentIndex,

        notes,
        setNotes,

        removeProduct,
        saveThirdSection,
        loadSummary,
        bucketCost,
    };

}



export default useCollectionRequestThirdSectionViewModel;