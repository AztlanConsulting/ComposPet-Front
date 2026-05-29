import Button from "../../../components/atoms/Button";
import Icon from "../../../components/atoms/Icon";
import '../../../css/atoms/clientTableColumnsDef.css';

import { validateField } from "./clientFieldsValidations";

export function getClientTableColumns({
    editingRowId,
    handleEdit,
    handleSave,
    handleCancel,
    isCellChanged,
    routeMap,
    routeOptions,
    showProblemAlert,
    setAlertInfo,
    loading,
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
                const isEditing = params.data.clientId === editingRowId;

                const isAnotherRowEditing = 
                    editingRowId !== null && params.data.clientId !== editingRowId;

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
        { field: "name", headerName: "Nombre" },
        { field: "lastRequest", headerName: "Última recolección" },

        {
            field: "balance",
            headerName: "Saldo",
            editable: (params) => params.data.clientId === editingRowId,
            cellEditor: "agNumberCellEditor",

            cellEditorParams: {
                suppressKeyboardEvent: blockInvalidNumberKeys
            },

            cellClassRules: modifiedClassRule,
            valueFormatter: (params) => {
                const value = Number(params.value ?? 0);

                return `$${value.toFixed(2)}`;
            },
            valueSetter: (params) => {
                const validation = validateField("balance", params.newValue);

                if (validation !== true) {
                    params.data.balance = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        if(!params.api.isDestroyed()) {
                            params.api.startEditingCell({
                                rowIndex: params.node.rowIndex,
                                colKey: "balance",
                            });
                        }
                    }, 0);

                    return false;
                }

                params.data.balance = Number(params.newValue);
                return true;
            },
        },

        {
            field: "notes",
            headerName: "Notas",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("notes", params.newValue);

                if (validation !== true) {

                    params.data.notes = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        if(!params.api.isDestroyed()) {
                            params.api.startEditingCell({
                                rowIndex: params.node.rowIndex,
                                colKey: "notes",
                            });
                        }
                    }, 0);

                    return false;
                }

                params.data.notes = params.newValue;
                return true;
            },
        },

        {
            field: "cellphone",
            headerName: "Teléfono",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
            cellDataType: false,
            cellEditor: "agNumberCellEditor",
            cellEditorParams: {
                suppressKeyboardEvent: blockInvalidNumberKeys
            },

            valueSetter: (params) => {
                const validation = validateField("cellphone", params.newValue);

                if (validation !== true) {
                    params.data.cellphone = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "cellphone",
                        });
                    }, 0);

                    return false;
                }

                params.data.cellphone = String(params.newValue);
                return true;
            },
        },

        {
            field: "address",
            headerName: "Dirección",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("address", params.newValue);

                if (validation !== true) {
                    params.data.address = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "address",
                        });
                    }, 0);

                    return false;
                }

                params.data.address = params.newValue;
                return true;
            },
        },

        {
            field: "routeId",
            headerName: "Ruta",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: routeOptions,
            },
            valueFormatter: (params) => {
                return routeMap[params.value] || params.value;
            },
            valueParser: (params) => {
                return params.newValue;
            },

        },
        {
            field: "order",
            headerName: "Orden",
            editable: (params) => params.data.clientId === editingRowId,
            cellEditor: "agNumberCellEditor",

            cellEditorParams: {
                suppressKeyboardEvent: blockInvalidNumberKeys
            },

            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("order", params.newValue);

                if (validation !== true) {
                    params.data.order = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "order",
                        });
                    }, 0);

                    return false;
                }

                params.data.order = Number(params.newValue);
                return true;
            },
        },
        {
            field: "pets",
            headerName: "Mascotas",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("pets", params.newValue);

                if (validation !== true){
                    params.data.pets = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "pets",
                        });
                    }, 0);
                    return false;
                }

                params.data.pets = params.newValue;
                return true;
            },
        },

        {
            field: "family",
            headerName: "Familia",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("family", params.newValue);

                if (validation !== true) {
                    params.data.family = params.oldValue;

                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);

                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "family",
                        });
                    }, 0);

                    return false;
                }

                params.data.family = params.newValue;
                return true;
            },
        },

        {
            field: "status",
            headerName: "Estatus",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
        },
    ];
}