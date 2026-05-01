import React from 'react';
import { AgGridReact } from "ag-grid-react";
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
            />
        </div>
    );
}