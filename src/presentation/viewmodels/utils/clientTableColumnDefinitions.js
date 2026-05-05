import Button from "../../../components/atoms/Button";
import Icon from "../../../components/atoms/Icon";
import '../../../css/atoms/clientTableColumnsDef.css';

export function getClientTableColumns({
    editingRowId,
    handleEdit,
    handleSave,
    handleCancel,
    isCellChanged,
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
        },

        {
            field: "notes",
            headerName: "Notas",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
        },

        {
            field: "cellphone",
            headerName: "Teléfono",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
        },

        {
            field: "address",
            headerName: "Dirección",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
        },

        {
            field: "route",
            headerName: "Ruta",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: ["Ruta 1", "Ruta 2"],
            },
        },

        {
            field: "pets",
            headerName: "Mascotas",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
        },

        {
            field: "family",
            headerName: "Familia",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
        },

        {
            field: "status",
            headerName: "Estatus",
            editable: (params) => params.data.clientId === editingRowId,
            cellClassRules: modifiedClassRule,
        },
    ];
}