import { useEffect, useState } from 'react';
import { GetRoutesInfoUseCase } from "../../../domain/useCases/routesInfo/routesTableUseCase";
import '../../../css/tokens/colors.css';

/**
 * ViewModel para la gestión de información de rutas.
 * Actúa como intermediario entre la vista y la capa de dominio,
 * manejando la lógica de presentación y transformando los datos
 * para su consumo en la interfaz de usuario.
 * 
 * @function useRoutesViewModel
 */
function useRoutesViewModel(){
    const [routesList, setRoutesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRoutesInfo = new GetRoutesInfoUseCase();

    const formPath = "/formulario-recoleccion";
    const formUrl = `https://www.compospetmx.org${formPath}`;
    const formLink = `¡Excelente día!

*¿Te anotamos para recolección mañana?* 🪣🚛
Apóyanos contestando el formulario de recolección de nuestra página ${formUrl} para registrar tu recolección 🫶🏼`;

    const copyLinkInfo = {
        text: "Formulario de recolección",
        link: formLink,
        bubbleMessage: "¡Copiado!",
    };

    // Diccionario para asignar colores a los productos extra según su tipo
    const PRODUCT_COLORS = {
        amarillo: "var(--color-yellow-primary)",
        naranja: "var(--color-orange-primary)",
        morado: "var(--color-purple-primary)",
        verde: "var(--color--green-products)",
    }

    // Función para determinar si una fila debe tener fondo
    const hasRowBackground = (data) => {
        return (
            data?.hasRequest === true &&
            (
                data?.status === false ||
                (data?.wantsExtraProducts === false && data?.wantsCollection === false)
            )
        )
    }

    // ==================== CONFIGURACIÓN DE TABLA ====================
    const columnDefinitions = [
        { headerName: "Nombre", field: "name", width: 200},
        { headerName: "# Recolección", field: "collectedBuckets", width: 200,
            cellStyle: (params) => {
                if (hasRowBackground(params.data)) {
                    return null;
                }

                if (String(params.value).trim() === "0") {
                    return {
                        color: "red",
                        fontWeight: "bold",
                    };
                }

                return null;
            },
        },
        { headerName: "# Entrega", field: "deliveredBuckets", width: 200,
            cellStyle: (params) => {
                if (hasRowBackground(params.data)) {
                    return null;
                }

                if (String(params.value).trim() === "0") {
                    return {
                        color: "red",
                        fontWeight: "bold",
                    };
                }

                return null;
            },
        },
        {
            headerName: "Productos Extra", field: "extraProducts", width: 250, autoHeight: true,
            cellRenderer: (params) => {
                const products = params.data?.extraProductsDetails || [];

                console.log("Productos detalle:", products);

                if (!products.length) {
                    return params.value || " ";
                }

                return (
                    <div>
                        {products.map((product, index) => (
                            <div
                                key={index}
                                style={{
                                    color: hasRowBackground(params.data)
                                        ? "inherit"
                                        : PRODUCT_COLORS[product.color] ||
                                        "#000",
                                }}
                            >
                                {product.text}
                            </div>
                        ))}
                    </div>
                );
            },
        },
        { headerName: "Horario", field: "schedule", width: 200},
        { headerName: "Forma de pago", field: "paymentMethod", width: 200},
        { headerName: "Total a pagar", field: "totalToPay", width: 200},
        { headerName: "Total pagado", field: "totalPaid", width: 200},
        { headerName: "Notas", field: "notes", width: 500},
    ];

    /**
     * Configuración por defecto para todas las columnas de la tabla.
     * Habilita ordenamiento, redimensionamiento y tooltips.
     */
    const defaultColDef = {
        sortable: true,
        resizable: true,
        tooltipField: "notes",
    };


    useEffect(() => {
        async function fetchRoutes(){
            setLoading(true);

            try{
                const routes = await getRoutesInfo.execute();
                setRoutesList(routes);
                console.log("Rutas obtenidas:", routes);
            } catch (error){
                setError(error.message || "Error al cargar la información");
            } finally {
                setLoading(false);
            }

        }

        fetchRoutes();
    }, []);

    return {
        routesList,
        loading,
        error,
        columnDefinitions,
        defaultColDef,
        copyLinkInfo,
    }
}

export default useRoutesViewModel;