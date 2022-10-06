import { useEffect, useState } from "react"
import LinearIndeterminate from "../../components/loaders/LinearIndeterminate"
import SingleSelectTable from "../../components/tables/SingleSelectTable"
// import Dashboard from "../dashboard/Dashboard"

function Runs() {

    const [runsData, setRunsData] = useState([])
    const credentials = btoa("admin:correctHorseBatteryStaple")
    // let rowData

    useEffect(() => {
        fetch('http://localhost:8081/v0/run/api/', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
            .then((r) => r.json())
            .then((data) => setRunsData(data.results))
    }, [])
            
    
    const rows = runsData.map((run) => {
        return (
            { 
                id: run.id, 
                name: run.name, 
                status: run.status, 
                app: run.app, 
                createdDate: run.created_date
            }
        )
    })



    // runsData.map((run) => {
    //     setRows({ id: run.id, name: run.name, status: run.status, app: run.app, createdDate: run.created_date })
    // })



    const columns = [
        { field: 'id', headerName: 'ID', width: 70, hide: true },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        {
          field: 'app',
          headerName: 'App',
          sortable: false,
          width: 90
        },
        {
          field: 'createdDate',
          headerName: 'Date Created',
          width: 160
        },
    ];

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

    


    if (runsData != []) {
        return (
            <SingleSelectTable columns={columns} rows={rows}/>
            // <div>
            //     <h1>Count: {runsData.count}</h1>
            // </div>
        )

    } else {
        return (
            <div>  
                <LinearIndeterminate />
            </div>
        )
    }
}

export default Runs