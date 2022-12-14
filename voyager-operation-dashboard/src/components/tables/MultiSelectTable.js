import { DataGrid } from '@mui/x-data-grid';

function MultiSelectTable({ columns, rows, selection }) {

  return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          sx={{
            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
              display: "none"
            }
          }}
          rows={rows}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
          checkboxSelection
          onSelectionModelChange={selection}
        />
      </div>
  );
};

export default MultiSelectTable