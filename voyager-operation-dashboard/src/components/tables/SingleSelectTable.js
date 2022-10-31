import { DataGrid } from '@mui/x-data-grid';

function SingleSelectTable({ columns, rows, selection }) {

    return (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
            // onRowClick={handleRowClick}
            checkboxSelection
            onSelectionModelChange={selection}
          />
        </div>
    );
};

export default SingleSelectTable