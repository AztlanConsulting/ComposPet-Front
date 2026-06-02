import React, { useCallback, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_ES } from '@ag-grid-community/locale';

import '../../css/organisms/ClientTable.css';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ClientTable({
    clientList,
    columnDefinitions,
    defaultColDef,
    loading,
    editingRowId,
    getRowClass,
}) {
    const gridRef = React.useRef(null);

    const autoSizeAllColumns = useCallback((api) => {
        if (!api) return;

        const columns = api.getColumns();
        if (!columns) return;

        const allColumnIds = columns.map(column => column.getId());

        api.autoSizeColumns(allColumnIds);
    }, []);

    useEffect(() => {
        const api = gridRef.current?.api;

        if (!api) return;

        requestAnimationFrame(() => {
            api.redrawRows();
        });
    }, [editingRowId]);

    useEffect(() => {
        const api = gridRef.current?.api;

        if (!api || !clientList.length) return;

        requestAnimationFrame(() => {
            autoSizeAllColumns(api);
        });
    }, [clientList, autoSizeAllColumns]);

    return (
        <div className='wrapper ag-theme-alpine custom-green-theme'>
            <AgGridReact
                ref={gridRef}
                rowData={clientList}
                columnDefs={columnDefinitions}
                defaultColDef={defaultColDef}
                loading={loading}
                pagination={true}
                enableBrowserTooltips={true}
                localeText={AG_GRID_LOCALE_ES}
                getRowClass={getRowClass}
                suppressDragLeaveHidesColumns={true}
                tooltipShowDelay={0}
                getRowHeight={(params) => {
                    const products = params.data?.extraProductsDetails || [];
                    const count = products.length;
                    if (count <= 1) return 42;
                    return count * 26 + 12;
                }}
                onBodyScroll={params => {
                    params.api.stopEditing(false);
                }}
                onCellClicked={(params) => {
                    if (
                        params.colDef.field === "extraProductsDetails" &&
                        params.data.name === editingRowId
                    ) {
                        params.api.startEditingCell({
                            rowIndex: params.rowIndex,
                            colKey: "extraProductsDetails",
                        });
                    }

                    if (editingRowId && params.data.clientId === editingRowId) {
                        setTimeout(() => {
                            const input = document.querySelector('.ag-cell-edit-input');
                            if (input) {
                                const length = input.value.length;
                                input.setSelectionRange(length, length);
                            }
                        });
                    }
                }}
                context={{ editingRowId }}
            />
        </div>
    );
}