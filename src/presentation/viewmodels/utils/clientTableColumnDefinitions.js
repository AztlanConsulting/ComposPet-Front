import Button from "../../../components/atoms/Button";
import Icon from "../../../components/atoms/Icon";
import '../../../css/atoms/clientTableColumnsDef.css';

import { validateField } from "./clientFieldsValidations";
import ValidationObserver from "./validationObserver";

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
            width: 100,
            minWidth: 100,
            maxWidth: 150,
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
                        disabled={isAnotherRowEditing}
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
        {
            field: "routeId",
            headerName: "Ruta",
            minWidth: 150,
            maxWidth: 220,
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
            minWidth: 80,
            maxWidth: 120,
            editable: (params) => params.data.clientId === editingRowId,
            cellEditor: "agNumberCellEditor",

            cellEditorParams: {
                suppressKeyboardEvent: blockInvalidNumberKeys
            },

            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("order", params.newValue);

                if (validation !== true) {
                    ValidationObserver.addError("order");
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

                ValidationObserver.removeError("order");
                params.data.order = Number(params.newValue);
                return true;
            },
        },
        { 
            field: "name", 
            headerName: "Nombre",
            minWidth: 200,
            maxWidth: 300,
         },
        { 
            field: "lastRequest", 
            headerName: "Última recolección",
            minWidth: 130,
            maxWidth: 180,
        },

        {
            field: "balance",
            headerName: "Saldo",
            minWidth: 100,
            maxWidth: 150,
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
                    ValidationObserver.addError("balance");
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

                ValidationObserver.removeError("balance");
                params.data.balance = Number(params.newValue);
                return true;
            },
        },

        {
            field: "notes",
            headerName: "Notas",
            minWidth: 150,
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("notes", params.newValue);

                if (validation !== true) {

                    ValidationObserver.addError("notes");
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

                ValidationObserver.removeError("notes");
                params.data.notes = params.newValue;
                return true;
            },
        },

        {
            field: "cellphone",
            headerName: "Teléfono",
            minWidth: 150,
            maxWidth: 200,
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
                    ValidationObserver.addError("cellphone");
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

                ValidationObserver.removeError("cellphone");
                params.data.cellphone = String(params.newValue);
                return true;
            },
        },

        {
            field: "address",
            headerName: "Dirección",
            minWidth: 150,
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("address", params.newValue);

                if (validation !== true) {
                    ValidationObserver.addError("address");
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

                ValidationObserver.removeError("address");
                params.data.address = params.newValue;
                return true;
            },
        },

        {
            field: "email",
            headerName: "Correo",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("email", params.newValue);

                if(validation !== true) {
                    ValidationObserver.addError("email");
                    params.data.email = params.oldValue;
                    
                    setTimeout(async () => {
                        await showProblemAlert("Error en los datos ingresados", validation);
                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: "email",
                        });
                    }, 0);
                    
                    return false;
                }

                ValidationObserver.removeError("email");
                params.data.email = params.newValue;
                return true;
            }
        },

        {
            field: "pets",
            headerName: "Mascotas",
            minWidth: 150,
            maxWidth: 250,
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("pets", params.newValue);

                if (validation !== true){
                    ValidationObserver.addError("pets");
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

                ValidationObserver.removeError("pets");
                params.data.pets = params.newValue;
                return true;
            },
        },

        {
            field: "family",
            headerName: "Familia",
            minWidth: 150,
            maxWidth: 250,
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("family", params.newValue);

                if (validation !== true) {
                    ValidationObserver.addError("family");
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

                ValidationObserver.removeError("family");
                params.data.family = params.newValue;
                return true;
            },
        },

        {
            field: "status",
            headerName: "Estatus",
            minWidth: 100,
            maxWidth: 100,
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: {
                ...modifiedClassRule,
                "cell-not-editable": (params) =>
                    params.data.clientId !== editingRowId,
            },
        },
    ];
}