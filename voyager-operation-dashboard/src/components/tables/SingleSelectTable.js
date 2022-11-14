import { DataGrid } from '@mui/x-data-grid';

function SingleSelectTable({ columns, rows, handleRowClick }) {

    return (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
            onRowClick={handleRowClick}
            checkboxSelection
          />
        </div>
    );
};

export default SingleSelectTable