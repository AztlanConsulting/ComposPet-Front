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
}) {

    const modifiedClassRule = {
        'cell-modified': (params) => isCellChanged(params)
    };



    return [
        {
            width: 150,
            headerName: "Editar",
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
                            >
                                <Icon name="plus" size="icon-medium" color="primary" />
                            </Button>

                            <Button 
                            className='action-button'
                            size='mini' 
                            csstype='warning' 
                            onClick={() => handleCancel(params)}
                            >
                                <Icon name="minus" size="icon-medium" color="primary" />
                            </Button>
                        </div>
                    );
                }

                return (
                    <div className="edit-div">
                        <Button 
                        className='action-button'
                        disabled={isAnotherRowEditing}
                        size='small' 
                        csstype='accept' 
                        onClick={() => handleEdit(params)}
                        >
                            <Icon name="piggy" size="icon-medium" color="primary" />
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
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("balance", params.newValue);

                if (validation !== true){
                    alert(validation);
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

                if (validation !== true){
                    alert(validation);
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

            valueSetter: (params) => {
                const validation = validateField("cellphone", params.newValue);

                if (validation !== true){
                    alert(validation);
                    return false;
                }

                params.data.phone = Number(params.newValue);
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

                if (validation !== true){
                    alert(validation);
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
            field: "pets",
            headerName: "Mascotas",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,

            valueSetter: (params) => {
                const validation = validateField("pets", params.newValue);

                if (validation !== true){
                    alert(validation);
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

                if (validation !== true){
                    alert(validation);
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