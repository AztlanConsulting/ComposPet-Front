import { useEffect, useState } from "react";
import { ExtraProductsUseCase } from "../../../domain/useCases/ExtraProducts";
import { SaveExtraProductsCollection } from "../../../domain/useCases/saveExtraProductsCollection";
import { SolicitudesRecRepository } from "../../../data/repositories/solicitudesRecRepository";
import { SolicitudesRecApiClient } from "../../../data/datasources/solicitudesRecApiClient";
import  { useAuthenticatedClient } from "../utils/useAuthenticatedClient";

function useSolicitudRecSegundaSeccionViewModel(idCliente) {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(() => {
        const saved = sessionStorage.getItem("selectedProducts");
        return saved ? JSON.parse(saved) : {};
    });

    const [idSolicitud, setIdSolicitud] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const apiClient = new SolicitudesRecApiClient();
    const repository = new SolicitudesRecRepository(apiClient);
    const extraProductsUseCase = new ExtraProductsUseCase(repository);
    const saveExtraProductsUseCase = new SaveExtraProductsCollection(repository);
    


    useEffect(() => {
        const cargarDatos = async () => {
            if (!idCliente) return;

            setLoading(true);
            setError("");
            setSuccessMessage("");

            try {

               // const solicitud = await obtenerUltimaSolicitudUseCase.execute(idCliente);
                //setIdSolicitud(solicitud?.idSolicitud || "");

                const result = await extraProductsUseCase.execute();
                setProducts(result || []);
            } catch (err) {
                setError(err.message || "Error al cargar los productos extra.");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [idCliente]);

    useEffect(() => {
        sessionStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    const handleAgregar = (id, stockDisponible) => {
        setSelectedProducts((prev) => {
            const totalSeleccionados = Object.keys(prev).length;
            const cantidadActual = prev[id] || 0;

            if (cantidadActual >= stockDisponible) return prev;
            if (totalSeleccionados >= 3 && !prev[id]) return prev;

            return { ...prev, [id]: cantidadActual + 1 };
        });
    };

    const handleEliminar = (id) => {
        setSelectedProducts((prev) => {
            const cantidadActual = prev[id] || 0;

            if (cantidadActual <= 1) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }

            return { ...prev, [id]: cantidadActual - 1 };
        });
    };

    const guardarSegundaSeccion = async () => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            if (!idSolicitud) {
                throw new Error("No hay solicitud activa.");
            }

            const productos = Object.entries(selectedProducts).map(([id, cantidad]) => ({
                id_producto: parseInt(id, 10),
                cantidad,
            }));

            const result = await saveExtraProductsUseCase.execute(idSolicitud, productos);

            setSuccessMessage(result.message || "Productos guardados correctamente.");
            sessionStorage.removeItem("selectedProducts");

            return {
                success: true,
                nextStep: 3,
            };
        } catch (err) {
            setError(err.message || "Error al guardar productos extra.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        selectedProducts,
        idSolicitud,
        loading,
        error,
        successMessage,
        handleAgregar,
        handleEliminar,
        guardarSegundaSeccion,
    };
}

export default useSolicitudRecSegundaSeccionViewModel;