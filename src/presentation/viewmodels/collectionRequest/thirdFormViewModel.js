import {useEffect, useState, useMemo, useRef} from "react";
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
    const [priceType, setPriceType] = useState(null);
    const [error, setError] = useState(null);
    const notesRequestId = useRef(null);

    const [loading, setLoading] = useState(false);
    const [paymentAviable, setPaymentAviable] = useState([]); 
    const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(0);
    const [notes, setNotes] = useState('');
    const requiresPayment = collectionTotal > 0;
    const isFreeService = priceType === "gratis" && bucketCost === 0 &&
        collection.quiere_recoleccion === true;

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
    }, []);

    useEffect(() => {
        if(idClient) {
            loadSummary();
        }
    }, [idClient]);

    const loadSummary = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await useCase.execute(
                idClient,
                weekStartDate,
                weekEndDate
            );

            const payMethods = response.payMethods ?? [];

            setCollection(response.collection);
            setProducts(response.products);
            setBalance(response.balance);
            setCollectionTotal(response.total);
            setPaymentMethods(payMethods);

            setSelectedPaymentIndex((currentIndex) => {
                if (payMethods.length === 0) {
                    return 0;
                }

                return currentIndex < payMethods.length
                    ? currentIndex
                    : 0;
            });

            if (notesRequestId.current !== response.collection.id_solicitud) {
                setNotes(response.collection.notas ?? '');
                notesRequestId.current = response.collection.id_solicitud;
            }

            setBucketCost(response.bucketCost);
            setPriceType(response.priceType);

            const aviableMethods = payMethods.map((method) => {
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
            setError(
                "No se pudo cargar el resumen de compra. Intenta cargarlo de nuevo."
            );
            console.error("Error loading summary: ", error);
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
            console.error("Error deleting product", error);
        }
        finally {
            setLoading(false);
        }
    }

    const saveThirdSection = async () => {
        if (loading || error || !collection.id_solicitud || bucketCost == null) {
            return { success: false };
        }

        const selectedPaymentMethod =
            paymentMethods[selectedPaymentIndex];

        if (requiresPayment && !selectedPaymentMethod) {
            setError("Selecciona una forma de pago.");
            return { success: false };
        }

        try {
            setLoading(true);

            await updateCollectionTotalUseCase.execute(
                collection.id_solicitud,
                collectionTotal,
                requiresPayment ? selectedPaymentMethod.id_pago : null,
                notes,
            );

            return {
                success: true,
                nextStep: 4,
            };
        }
        catch (error) {
            setError("No se pudo guardar la solicitud. Intenta de nuevo.");
            console.error(error);
            return { success: false };
        }
        finally {
            setLoading(false);
        }
    };

    return {
        collection,
        products,
        balance,
        collectionTotal,
        paymentMethods,
        paymentAviable,
        loading,
        error,
        requiresPayment,
        isFreeService,

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
