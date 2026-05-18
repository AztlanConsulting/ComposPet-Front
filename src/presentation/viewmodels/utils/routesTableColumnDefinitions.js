import Button from "../../../components/atoms/Button";
import Icon from "../../../components/atoms/Icon";
import '../../../css/atoms/clientTableColumnsDef.css';

import { validateField } from "./routesFieldsValidation";

// Diccionario para asignar colores a los productos extra según su tipo
const PRODUCT_COLORS = {
    amarillo: "var(--color-yellow-primary)",
    naranja: "var(--color-orange-primary)",
    morado: "var(--color-purple-primary)",
    verde: "var(--color-green-products)",
}

export function getRoutesTableColumns({
    editingRowId,
    handleEdit,
    handleSave,
    handleCancel,
    isCellChanged,
    hasRowBackground,
    hasRedBackground,
    showProblemAlert,
    setAlertInfo,
    loading,
    payMap,
    payOptions,
}) {

    const modifiedClassRule = {
        'cell-modified': (params) => isCellChanged(params)
    };

    function blockInvalidNumberKeys(params) {
        const forbiddenKeys = ["e", "E"];
        return forbiddenKeys.includes(params.event.key);
    }

    function blockInvalidNumberKeys(params) {
        const forbiddenKeys = ["e", "E"];
        return forbiddenKeys.includes(params.event.key);
    }

    return [
        {
            width: 150,
            headerName: "Editar",
            cellRenderer: (params) => {
                const isEditing = params.data.name === editingRowId;

                const isAnotherRowEditing = 
                    editingRowId !== null && params.data.name !== editingRowId;

                if (isEditing) {
                    return (
                        <div className="save-discard-div">
                            <Button 
                            className='action-button'
                            size='mini' 
                            csstype='cancel' 
                            onClick={() => handleSave(params)}
                            disabled={loading}
                            >
                                <Icon name="save" size="icon-medium" color="primary"/>
                            </Button>
                            <Button 
                            className='action-button'
                            size='mini' 
                            csstype='warning' 
                            onClick={() => handleCancel(params)}
                            disabled={loading}
                            >
                                <Icon name="cancel" size="icon-medium" color="primary"/>
                            </Button>
                        </div>
                    );
                }

                return (
                    <div className="edit-div">
                        <Button 
                        className='action-button'
                        disabled={isAnotherRowEditing}
                        size='mini' 
                        csstype='accept' 
                        onClick={() => handleEdit(params)}
                        >
                            <Icon name="edit" size="icon-medium" color="primary" />
                        </Button>
                    </div>

                );
            }
        },
        { headerName: "Nombre", field: "name", width: 200},
        // Recoleccion
        { headerName: "# Recolección", field: "collectedBuckets", width: 200,
            editable: (params) => params.data.name === editingRowId,
            cellEditor: "agNumberCellEditor",
            cellEditorParams: {
                suppressKeyboardEvent: blockInvalidNumberKeys
            },
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("collectedBuckets", params.newValue);

                if (validation !== true) {
                    params.data.collectedBuckets = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "collectedBuckets",
                        });
                    }, 0);
                    return false;
                }

                params.data.collectedBuckets = Number(params.newValue);
                return true;
            },

            // estilo de la celda para resaltar en rojo si el valor es 0, o si la fila tiene fondo rojo
            cellStyle: (params) => {
                // si tiene fondo rojo, resaltar en negrita
                if (hasRowBackground(params.data)) {
                    return hasRedBackground(params.data)
                        ? { fontWeight: "var(--font-weight-bold)" }
                        : null;
                }
                // si el valor es 0, resaltar en rojo y negrita
                if (params.value === "0") {
                    return {
                        color: "var(--color-red-primary)",
                        fontWeight: "var(--font-weight-bold)",
                    };
                }

                return null;
            },
        },
        // Entrega
        { headerName: "# Entrega", field: "deliveredBuckets", width: 200,
            editable: (params) => params.data.name === editingRowId,
            cellEditor: "agNumberCellEditor",
            cellEditorParams: {
                suppressKeyboardEvent: blockInvalidNumberKeys
            },
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("deliveredBuckets", params.newValue);

                if (validation !== true) {
                    params.data.deliveredBuckets = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "deliveredBuckets",
                        });
                    }, 0);
                    return false;
                }

                params.data.deliveredBuckets = Number(params.newValue);
                return true;
            },

            // estilo de la celda para resaltar en rojo si el valor es 0, o si la fila tiene fondo rojo
            cellStyle: (params) => {
                if (hasRowBackground(params.data)) {
                    return hasRedBackground(params.data)
                        ? { fontWeight: "var(--font-weight-bold)" }
                        : null;
                }
                // si el valor es 0, resaltar en rojo y negrita
                if (params.value === "0") {
                    return {
                        color: "var(--color-red-primary",
                        fontWeight: "var(--font-weight-bold)",
                    };
                }

                return null;
            },
        },
        // Productos extra con personalizado para mostrar cada producto en su color correspondiente
        {
            headerName: "Productos Extra", field: "extraProducts", width: 250, autoHeight: true,
            cellRenderer: (params) => {
                const products = params.data?.extraProductsDetails || [];

                // Si no hay productos extra, mostrar un espacio
                if (!products.length) {
                    return params.value || " ";
                }

                return (
                    <div>
                        {/* Muestra cada producto con su color correspondiente */}
                        {products.map((product, index) => (
                            <div
                                key={index}
                                style={{
                                    // Si la fila tiene fondo, usar color de texto normal, si no, usar el color del producto
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
        { 
            headerName: "Forma de pago", 
            field: "paymentId", 
            width: 200,
            editable: (params) => params.data.name === editingRowId,
            cellClassRules: modifiedClassRule,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: payOptions,
            },
            valueFormatter: (params) => {
                return payMap[params.value] || params.value;
            },
            valueParser: (params) => {
                return params.newValue;
            }
        },
        { headerName: "Total a pagar", field: "totalToPay", width: 200},
        { headerName: "Total pagado", field: "totalPaid", width: 200},
        { 
            headerName: "Notas", 
            field: "notes", 
            width: 500,
            editable: (params) => params.data.name === editingRowId,
            cellClassRules: modifiedClassRule,
            valueSetter: (params) => {
                const validation = validateField("notes", params.newValue);
                if (validation !== true) {
                    params.data.notes = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "notes",
                        });
                    }, 0);

                    return false;
                }

                params.data.notes = params.newValue;
                return true;
            },
        },

    ];
}