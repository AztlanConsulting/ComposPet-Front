import Button from "../../../components/atoms/Button";
import Icon from "../../../components/atoms/Icon";
import SearchInput from "../../../components/molecules/searchInput";
import '../../../css/atoms/clientTableColumnsDef.css';
import '../../../css/atoms/button.css';

import { validateField } from "./routesFieldsValidation";
import ValidationObserver from "./validationObserver";
import { forwardRef, useImperativeHandle, useState, useEffect, useRef , useMemo} from "react";

// Diccionario para asignar colores a los productos extra según su tipo
const PRODUCT_COLORS = {
    amarillo: "var(--color-yellow-primary)",
    naranja: "var(--color-orange-primary)",
    morado: "var(--color-purple-primary)",
    verde: "var(--color-green-products)",
}

/**
 * Renderiza el encabezado personalizado de la columna de horario
 * en la tabla, mostrando el título principal y el formato esperado
 * de la hora (HH:MM) como subtítulo.
 *
 * @component
 * @returns {JSX.Element} Encabezado visual para la columna de horario.
 */
function ScheduleHeader() {
    return (
        <div className="custom-header">
            <span className="header-title">
                Horario
            </span>
            <br />
            <span className="header-subtitle">
                (HH:MM)
            </span>
        </div>
    );
}

const ExtraProductsCellEditor = forwardRef((props, ref) => {
    const allProducts = props.extraProducts || [];

    const searchProduct = props.searchProduct || '';
    const handleSearchProduct = props.handleSearchProduct;

    const filteredProducts = useMemo(() => {
        const query = searchProduct.trim().toLowerCase();

        if (!query) return allProducts;

        return allProducts.filter(product =>
            product.nombre.toLowerCase().includes(query)
        );
    }, [allProducts, searchProduct]);

    const buildSelectedState = () => {
        const initial = {};

        (props.data?.extraProductsDetails || []).forEach(d => {
            const product = allProducts.find(
                p => p.nombre === d.text.split(" (")[0]
            );

            if (product) {
                const match = d.text.match(/\((\d+)\)$/);

                initial[product.id_producto] = match
                    ? parseInt(match[1])
                    : 1;
            }
        });

        return initial;
    };

    const initialSelected = useMemo(
        () => buildSelectedState(),
        []
    );

    const [selected, setSelected] = useState(initialSelected);

    const [inputValues, setInputValues] = useState(() => {
        const vals = {};

        Object.entries(initialSelected).forEach(([id, qty]) => {
            vals[id] = String(qty);
        });

        return vals;
    });

    const selectedRef = useRef(selected);

    useEffect(() => {
        selectedRef.current = selected;
    }, [selected]);

    const toggle = (id) => {
        setSelected(prev => {
            const next = { ...prev };

            if (next[id] !== undefined) {
                delete next[id];

                setInputValues(v => {
                    const n = { ...v };
                    delete n[id];
                    return n;
                });
            } else {
                next[id] = 1;

                setInputValues(v => ({
                    ...v,
                    [id]: "1",
                }));
            }

            selectedRef.current = next;
            props.onSelectionChange?.(next);

            return next;
        });
    };

    const handleQuantityChange = (id, rawValue) => {
        setInputValues(prev => ({ ...prev, [id]: rawValue }));

        const parsed = parseInt(rawValue);
        if (!isNaN(parsed) && parsed >= 1) {
            const safe = Math.min(parsed, 999);
            setInputValues(prev => ({ ...prev, [id]: String(safe) }));
            setSelected(prev => {
                const next = { ...prev, [id]: safe };
                selectedRef.current = next;
                props.onSelectionChange?.(next);
                return next;
            });
        }
    };

    const handleQuantityBlur = (id) => {
        const raw = inputValues[id];
        const parsed = parseInt(raw);
        const safe = (!isNaN(parsed) && parsed >= 1) ? parsed : 1;

        setInputValues(prev => ({ ...prev, [id]: String(safe) }));
        setSelected(prev => {
            const next = { ...prev, [id]: safe };
            selectedRef.current = next;
            props.onSelectionChange?.(next);
            return next;
        });
    };

    return (
        <div className="extra-products-menu">
        <SearchInput
            value={searchProduct}
            onChange={(e) => handleSearchProduct(e.target.value)}
            onInput={(e) => handleSearchProduct(e.target.value)}
            placeholder="Buscar producto extra"
        />
            {filteredProducts.map((product) => {
                const isSelected = selected[product.id_producto] !== undefined;
                return (
                    <div 
                        key={product.id_producto}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}
                    >
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggle(product.id_producto)}
                            id={`product-${product.id_producto}`}
                        />
                        <label htmlFor={`product-${product.id_producto}`} style={{ flex: 1 }}>
                            {product.nombre}
                        </label>
                        {isSelected && (
                            <input
                                type="number"
                                min={1}
                                value={inputValues[product.id_producto] ?? ""}
                                onChange={(e) => handleQuantityChange(product.id_producto, e.target.value)}
                                onBlur={() => handleQuantityBlur(product.id_producto)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
});

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
    extraProducts,
    getRowClass,
    handleSearchProduct,
    searchProduct,
}) {

    const modifiedClassRule = {
        'cell-modified': (params) => isCellChanged(params)
    };

    function blockInvalidNumberKeys(params) {
        const forbiddenKeys = ["e", "E"];
        return forbiddenKeys.includes(params.event.key);
    }


    const EditableHeader = ({ title, isEditing }) => (
        <div className="editable-header">
            <span>{title}</span>

            {isEditing && (
                <span className="editable-header-icon">
                    <Icon name="edit" size="icon-mini" />
                </span>
            )}
        </div>
    );

    const editableHeader = (title) => () => (
        <EditableHeader
            title={title}
            isEditing={editingRowId !== null}
        />
    );

    return [
        {
            width: 100,
            minWidth: 100,
            maxWidth: 150,
            pinned: 'left',
            tooltipValueGetter: (params) => params.value || "",
            lockPinned: true,
            suppressMovable: true,
            headerName: "Editar",
            cellClass: 'edit-cell edit-cell-front',
            pinned: "left",
            lockPinned: true,

            tooltipValueGetter: (params) => {
                if (!params.data?.hasRequest) {
                    return "No hay registros para editar";
                }
            
                if (editingRowId !== null && params.data?.name !== editingRowId) {
                    return "Termina de editar la fila actual";
                }
            
                return null;
            },

            cellRenderer: (params) => {
                const isEditing = params.data.name === editingRowId;
            
                const isAnotherRowEditing =
                    editingRowId !== null && params.data.name !== editingRowId;
            
                const isEditDisabled =
                    isAnotherRowEditing || !params.data.hasRequest;
            
                if (isEditing) {
                    return (
                        <div className="save-discard-div">
                            <Button
                                className="action-button"
                                size="mini-icon"
                                csstype="cancel"
                                onClick={() => handleSave(params)}
                                disabled={loading}
                            >
                                <Icon name="save" size="icon-medium" color="primary" />
                            </Button>
            
                            <Button
                                className="action-button"
                                size="mini-icon"
                                csstype="warning"
                                onClick={() => handleCancel(params)}
                                disabled={loading}
                            >
                                <Icon name="cancel" size="icon-medium" color="primary" />
                            </Button>
                        </div>
                    );
                }
            
                return (
                    <div className="edit-div">
                        <Button
                            className="action-button"
                            disabled={isEditDisabled}
                            size="mini-icon"
                            csstype="accept"
                            onClick={() => handleEdit(params)}
                        >
                            <Icon name="edit" size="icon-medium" color="primary" />
                        </Button>
                    </div>
                );
            }
        },
        { 
            headerName: "Nombre", 
            field: "name", 
            minWidth: 200,
            maxWidth: 300,
            tooltipValueGetter: (params) => params.value || "",
        },
        // Recoleccion
        { 
            headerName: "# Recolección",
            field: "collectedBuckets", 
            minWidth: 130,
            maxWidth: 170,
            editable: (params) => params.data.name === editingRowId,
            headerComponent: editableHeader("# Recolección"),
            cellEditor: "agNumberCellEditor",
            cellEditorParams: {
                suppressKeyboardEvent: blockInvalidNumberKeys
            },
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const raw = Number(params.newValue);

                const validation = validateField("collectedBuckets", raw);

                if (validation !== true) {
                    ValidationObserver.addError("collectedBuckets");
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

                ValidationObserver.removeError("collectedBuckets");
                params.data.collectedBuckets = Math.floor(raw);
                return true;
            },

            // estilo de la celda para resaltar en rojo si el valor es 0, o si la fila tiene fondo rojo
            cellStyle: (params) => {
                const rowClass = getRowClass({ data: params.data });

                if (rowClass === "row-inactive") {
                    return {
                        fontWeight: "var(--font-weight-bold)",
                        color: "var(--color-red-primary)",
                    };
                }

                return null;
            },
        },
        // Entrega
        { 
            headerName: "# Entrega", 
            field: "deliveredBuckets", 
            minWidth: 130,
            maxWidth: 170,
            editable: (params) => params.data.name === editingRowId,
            cellEditor: "agNumberCellEditor",
            cellEditorParams: {
                suppressKeyboardEvent: blockInvalidNumberKeys
            },
            headerComponent: editableHeader("# Entrega"),
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const raw = Number(params.newValue);

                const validation = validateField("deliveredBuckets", raw);

                if (validation !== true) {
                    ValidationObserver.addError("deliveredBuckets");
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

                ValidationObserver.removeError("deliveredBuckets");
                params.data.deliveredBuckets = Math.floor(raw);
                return true;
            },

            // estilo de la celda para resaltar en rojo si el valor es 0, o si la fila tiene fondo rojo
            cellStyle: (params) => {
                const rowClass = getRowClass({ data: params.data });

                if (rowClass === "row-inactive") {
                    return {
                        fontWeight: "var(--font-weight-bold)",
                        color: "var(--color-red-primary)",
                    };
                }

                return null;
            },
        },
        // Productos extra con personalizado para mostrar cada producto en su color correspondiente
        {
            headerName: "Productos Extra", 
            field: "extraProductsDetails",
            suppressClickEdit: true,
            cellClass: 'multiline-cell',
            minWidth: 180,
            maxWidth: 300,
            wrapText: true,
            autoHeight: true, 
            cellDataType: false,
            headerComponent: editableHeader("Productos Extra"),
            valueFormatter: () => "",
            editable: (params) => params.data.name === editingRowId,
            cellClassRules: modifiedClassRule,
            cellEditor: ExtraProductsCellEditor,
            cellEditorParams: (params) => ({
                extraProducts,
                searchProduct,
                handleSearchProduct,

                onSelectionChange: (newSelected) => {
                    const selectedIds = Object.keys(newSelected).map(Number);

                    const selectedProducts = extraProducts.filter(p =>
                        selectedIds.includes(p.id_producto)
                    );

                    params.data.extraProductsArray = newSelected;

                    params.data.extraProductsDetails =
                        selectedProducts.map(p => ({
                            text: newSelected[p.id_producto] > 1
                                ? `${p.nombre} (${newSelected[p.id_producto]})`
                                : p.nombre,
                            color: p.color,
                        }));

                    params.data.extraProducts =
                        params.data.extraProductsDetails
                            .map(p => p.text)
                            .join("\n");

                    setTimeout(() => {
                        params.api.resetRowHeights();
                        params.api.refreshCells({
                            rowNodes: [params.node],
                            columns: ['extraProductsDetails'],
                            force: true,
                        });
                    }, 0);
                },
            }),

            cellEditorPopup: true,
            cellEditorPopupPosition: 'under',

            suppressKeyboardEvent: () => true,

            valueSetter: (params) => {

                return true;
            },

            cellRenderer: (params) => {
                const products = params.data?.extraProductsDetails || [];
                if (!products.length) return params.data?.extraProducts || " ";

                return (
                    <div style={{ 
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        padding: "4px 0",
                    }}>
                        {products.map((product, index) => (
                            <div
                                key={index}
                                style={{
                                    color: hasRowBackground(params.data)
                                        ? "inherit"
                                        : PRODUCT_COLORS[product.color] || "#000",
                                    lineHeight: "1.6",
                                }}
                            >
                                {product.text}
                            </div>
                        ))}
                    </div>
                );
            },
        },
        { 
            headerComponent: ScheduleHeader,
            field: "schedule", 
            minWidth: 120,
            maxWidth: 120,
            tooltipValueGetter: (params) => {
                const value = params.value == null
                    ? ""
                    : String(params.value).trim();

                return value || null;
            },
            editable: (params) => params.data.name === editingRowId,
            cellClassRules: modifiedClassRule,
            headerComponent: editableHeader("Horario"),
            valueSetter: (params) => {

                const sanitized = (params.newValue ?? "")
                    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
                    .slice(0, 255);

                const validation = validateField("schedule", sanitized);

                if(validation !== true) {
                    ValidationObserver.addError("schedule");
                    params.data.schedule = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "schedule",
                        });
                    }, 0);
                    return false;
                }

                params.data.schedule = sanitized;
                ValidationObserver.removeError("schedule");
                return true;
            }
        },
        { 
            headerName: "Forma de pago", 
            field: "paymentId", 
            minWidth: 180,
            maxWidth: 200,
            editable: (params) => params.data.name === editingRowId,
            headerComponent: editableHeader("Forma de pago"),
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
        { headerName: "Total a pagar", 
            field: "totalToPay", 
            minWidth: 150,
            maxWidth: 180,
            valueFormatter: (params) => {
                const value = Number(params.value ?? 0);

                return `$${value.toFixed(2)}`;
            },
        },
        { 
            headerName: "Total pagado", 
            field: "totalPaid", 
            minWidth: 150,
            maxWidth: 180,
            editable: (params) => params.data.name === editingRowId,
            headerComponent: editableHeader("Total pagado"),
            cellEditor: "agNumberCellEditor",

            cellEditorParams: {
                suppressKeyboardEvent: blockInvalidNumberKeys
            },
            valueFormatter: (params) => {
                const value = Number(params.value ?? 0);

                return `$${value.toFixed(2)}`;
            },
            valueParser: (params) => {
                return params.newValue;
            },

            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("paid", params.newValue);

                if(validation !== true) {
                    ValidationObserver.addError("totalPaid");
                    params.data.totalPaid = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "totalPaid",
                        });
                    }, 0);

                    return false;
                }

                ValidationObserver.removeError("totalPaid");
                params.data.totalPaid = params.newValue;
                return true;
            }
        },
        { 
            headerName: "Notas", 
            field: "notes", 
            minWidth: 200,
            maxWidth: 350,
            tooltipValueGetter: (params) => {
                const value = params.value == null
                    ? ""
                    : String(params.value).trim();

                return value || null;
            },
            wrapText: true,
            autoHeight: true,
            editable: (params) => params.data.name === editingRowId,
            headerComponent: editableHeader("Notas"),
            cellClassRules: modifiedClassRule,
            valueSetter: (params) => {

                const sanitized = (params.newValue ?? "")
                    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
                    .slice(0, 255);

                const validation = validateField("notes", sanitized);

                if (validation !== true) {
                    ValidationObserver.addError("notes");
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

                ValidationObserver.removeError("notes");
                params.data.notes = sanitized;
                return true;
            },
        },

    ];
}