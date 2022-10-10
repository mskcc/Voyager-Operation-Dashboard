import { useEffect, useState } from "react"
import LinearIndeterminate from "../../components/loaders/LinearIndeterminate"
import SingleSelectTable from "../../components/tables/SingleSelectTable"
// import Dashboard from "../dashboard/Dashboard"

function Runs() {

    const [runsData, setRunsData] = useState([])
    const [pipelineData, setPipelineData] = useState([])
    const credentials = btoa("admin:correctHorseBatteryStaple")
    let rows

    useEffect(() => {
        function fetchRunData() {
            fetch('http://localhost:8081/v0/run/api/', {
                headers: {'Authorization': `Basic ${credentials}`}
            })
                .then((r) => r.json())
                .then((data) => {
                    setRunsData(data.results)
                    }  
                )}

            fetch('http://localhost:8081/v0/run/pipelines/', {
                headers: {'Authorization': `Basic ${credentials}`}
            })
                .then((r) => r.json())
                .then((data) => setPipelineData(data.results))  
                
        fetchRunData()
    }, [])

    // const pipelineArray = pipelineData.map((pipeline) => {
    //     return pipeline
    // })


    function matchApp(appId) {
        return pipelineData.find(element => element.id === appId)
    //     if (pipelineArray.id === run.app) {
    //         return pipelineArray.name
    //     }
        
    }

    // pipelineData.find(element => element.id === run.app)


    rows = runsData.map((run) => {
        return (
            { 
                id: run.id, 
                name: run.name, 
                status: run.status, 
                app: run.app, 
                pipeline: matchApp(run.app),
                createdDate: run.created_date,
                request: run.request_id
            }
        )
    })





    const columns = [
        { field: 'id', headerName: 'ID', width: 70, hide: true },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'status', headerName: 'Status', width: 250 },
        { field: 'request', headerName: 'Request', width: 250 },
        { field: 'pipeline', headerName: 'Pipeline', width: 250 },
        // {
        //   field: 'pipeline',
        //   headerName: 'Pipeline',
        //   sortable: false,
        //   width: 250
        // },
        {
          field: 'createdDate',
          headerName: 'Date Created',
          width: 250
        },
    ];

    if (runsData !== []) {
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