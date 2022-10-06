import { DataGrid } from '@mui/x-data-grid';

function SingleSelectTable({ columns, rows }) {

    // const columns = [
    //     { field: 'id', headerName: 'ID', width: 70, hide: true },
    //     { field: 'name', headerName: 'Name', width: 130 },
    //     { field: 'status', headerName: 'Status', width: 130 },
    //     {
    //       field: 'app',
    //       headerName: 'App',
    //       sortable: false,
    //       width: 90
    //     },
    //     {
    //       field: 'createdDate',
    //       headerName: 'Date Created',
    //       description: 'This column has a value getter and is not sortable.',
    //       width: 160
    //     },
    // ];
      
    // const rows = [
    //     { id: 1, name: 'Snow', status: 'Jon', app: 35, createdDate: 12, },
    //     { id: 2, name: 'Lannister', status: 'Cersei', app: 42, createdDate: 12, },
    //     { id: 3, name: 'Lannister', status: 'Jaime', app: 45, createdDate: 12,  },
    //     { id: 4, name: 'Stark', status: 'Arya', app: 16, createdDate: 12,  },
    //     { id: 5, name: 'Targaryen', status: 'Daenerys', app: null, createdDate: 12,  },
    //     { id: 6, name: 'Melisandre', status: null, app: 150, createdDate: 12,  },
    //     { id: 7, name: 'Clifford', status: 'Ferrara', app: 44, createdDate: 12,  },
    //     { id: 8, name: 'Frances', status: 'Rossini', app: 36, createdDate: 12,  },
    //     { id: 9, name: 'Roxie', status: 'Harvey', app: 65, createdDate: 12,  },
    // ];


    return (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
            // checkboxSelection
          />
        </div>
    );
};

export default SingleSelectTable