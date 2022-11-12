import { DataGrid } from '@mui/x-data-grid';

function SingleRowSelectionGrid({rows, columns, selection}) {
  
    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
        rows={rows}
        columns={columns}
        onSelectionModelChange={selection}
        />
      </div>
    );
}

export default SingleRowSelectionGrid