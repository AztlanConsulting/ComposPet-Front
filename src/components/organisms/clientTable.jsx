import React from 'react';
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_ES } from '@ag-grid-community/locale';

import '../../css/organisms/ClientTable.css';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);
/**
 * Organismo de la tabla de información de clientes
 *
 * @param {List<ClientInfo>} clientList
 * @param {List<Object>} columnDefinitions
 * @param {Object} defaultColDef
 * 
 */

export default function ClientTable({
    clientList,
    columnDefinitions,
    defaultColDef,
    loading,
    editingRowId,
    getRowClass,
}) {

    return (
        <div className='wrapper ag-theme-alpine custom-green-theme'>
            <AgGridReact
                rowData={clientList}
                columnDefs={columnDefinitions}
                defaultColDef={defaultColDef}
                loading={loading}
                pagination={true}
                enableBrowserTooltips={true}
                localeText={AG_GRID_LOCALE_ES}
                editType="fullRow"
                getRowClass={getRowClass}
            />
        </div>
    );
}