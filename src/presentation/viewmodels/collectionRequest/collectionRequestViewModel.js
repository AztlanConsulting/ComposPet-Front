import { useState } from "react";
import { ExtraProductsUseCase } from "../../../domain/useCases/ExtraProducts";
import { SaveExtraProductsCollection } from "../../../domain/useCases/saveExtraProductsCollection";
import { SolicitudesRecRepository } from "../../../data/repositories/solicitudesRecRepository";
import { SolicitudesRecApiClient } from "../../../data/datasources/solicitudesRecApiClient";
import { ObtenerUltimaSolicitudUseCase } from "../../../domain/useCases/obtenerUltimaSolicitudRec";

function CollectionRequestViewModel() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [idSolicitud, setIdSolicitud] = useState("");

    const token = sessionStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const idCliente = payload.id;
    console.log("Toke", token);
    console.log("Payload", payload);
    console.log("ID Cliente", idCliente);

    const apiClient = new SolicitudesRecApiClient();
    const repository = new SolicitudesRecRepository(apiClient);
    const extraProductsUseCase = new ExtraProductsUseCase(repository);
    const saveExtraProductsUseCase = new SaveExtraProductsCollection(repository);
    const obtenerUltimaSolicitudUseCase = new ObtenerUltimaSolicitudUseCase(repository);

    const loadUltimaSolicitud = async () => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const result = await obtenerUltimaSolicitudUseCase.execute(idCliente);
            setIdSolicitud(result?.idSolicitud || "");
            console.log("RESULTADO ULTIMA SOLICITUD", result);
            return result;
        } catch (err) {
            setError(err.message || "Error loading latest collection request");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loadExtraProducts = async () => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const result = await extraProductsUseCase.execute();
            setProducts(result);
        } catch (err) {
            setError(err.message || "Error loading extra products");
        } finally {
            setLoading(false);
        }
    };

    const saveExtraProducts = async (productos) => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            if (!idSolicitud) {
                throw new Error("No hay solicitud activa");
            }
            const result = await saveExtraProductsUseCase.execute(idSolicitud, productos);
            setSuccessMessage(result.message || "Productos guardados correctamente");
            return result;
        } catch (err) {
            setError(err.message || "Error saving extra products");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        successMessage,
        loadExtraProducts,
        saveExtraProducts,
        loadUltimaSolicitud,
    };
}

export default CollectionRequestViewModel;