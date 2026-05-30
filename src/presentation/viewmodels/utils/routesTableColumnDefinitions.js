import Button from "../../../components/atoms/Button";
import Icon from "../../../components/atoms/Icon";
import SearchInput from "../../../components/molecules/searchInput";
import '../../../css/atoms/clientTableColumnsDef.css';

import { validateField } from "./routesFieldsValidation";
import { forwardRef, useImperativeHandle, useState, useEffect, useRef , useMemo} from "react";

// Diccionario para asignar colores a los productos extra según su tipo
const PRODUCT_COLORS = {
    amarillo: "var(--color-yellow-primary)",
    naranja: "var(--color-orange-primary)",
    morado: "var(--color-purple-primary)",
    verde: "var(--color-green-products)",
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
            setSelected(prev => {
                const next = { ...prev, [id]: parsed };
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

    return [
        {
            width: 150,
            pinned: 'left',
            lockPinned: true,
            suppressMovable: true,
            headerName: "Editar",
            cellClass: 'edit-cell',
            pinned: "left",
            lockPinned: true,
            cellRenderer: (params) => {
                const isEditing = params.data.name === editingRowId;

                const isAnotherRowEditing = 
                    editingRowId !== null && params.data.name !== editingRowId;

                if (isEditing) {
                    return (
                        <div className="save-discard-div">
                            <Button 
                            className='action-button'
                            size='mini-icon' 
                            csstype='cancel' 
                            onClick={() => handleSave(params)}
                            disabled={loading}
                            >
                                <Icon name="save" size="icon-medium" color="primary"/>
                            </Button>
                            <Button 
                            className='action-button'
                            size='mini-icon' 
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
                        disabled={isAnotherRowEditing || !params.data.hasRequest}
                        size='mini-icon' 
                        csstype='accept' 
                        onClick={() => handleEdit(params)}
                        >
                            <Icon name="edit" size="icon-medium" color="primary" />
                        </Button>
                    </div>

                );
            }
        },
        { headerName: "Nombre", field: "name", width: 300},
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
            cellClass: 'multiline-cell',
            width: 250, 
            cellDataType: false,
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
            headerName: "Horario", 
            field: "schedule", 
            width: 200,
            editable: (params) => params.data.name === editingRowId,
            cellClassRules: modifiedClassRule,
            valueSetter: (params) => {
                const validation = validateField("schedule", params.newValue);

                if(validation !== true) {
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

                params.data.schedule = params.newValue;
                return true;
            }
        },
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
        { headerName: "Total a pagar", 
            field: "totalToPay", 
            width: 200,
            valueFormatter: (params) => {
                const value = Number(params.value ?? 0);

                return `$${value.toFixed(2)}`;
            },
        },
        { 
            headerName: "Total pagado", 
            field: "totalPaid", 
            width: 200,
            editable: (params) => params.data.name === editingRowId,
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

                params.data.totalPaid = params.newValue;
                return true;
            }
        },
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