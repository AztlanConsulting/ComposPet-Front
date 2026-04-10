import {use, useState} from "react";

import { ExtraProductsUseCase } from "../../../domain/useCases/ExtraProducts";
import { SolicitudesRecRepository } from "../../../data/repositories/solicitudesRecRepository";
import { SolicitudesRecApiClient } from "../../../data/datasources/solicitudesRecApiClient";

function CollectionRequestViewModel() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadExtraProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const apiClient = new SolicitudesRecApiClient();
            const repository = new SolicitudesRecRepository(apiClient);
            const useCase = new ExtraProductsUseCase(repository);

            const result = await useCase.execute();
            setProducts(result);
        } catch (err){
            setError(err.message || "Error loading extra products");
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        loadExtraProducts,
    };
}

export default CollectionRequestViewModel;