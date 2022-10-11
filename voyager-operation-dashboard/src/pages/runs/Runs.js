import { useEffect, useState } from "react"
import LinearIndeterminate from "../../components/loaders/LinearIndeterminate"
import SingleSelectTable from "../../components/tables/SingleSelectTable"
import Alert from '@mui/material/Alert';
// import Dashboard from "../dashboard/Dashboard"

function Runs() {

    const [runsData, setRunsData] = useState([])
    const [singleRun, setSingleRun] = useState('')
    const [pipelineData, setPipelineData] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const credentials = btoa("admin:correctHorseBatteryStaple")
    let rows

    useEffect(() => {
        function fetchRunData() {
            fetch('http://localhost:8081/v0/run/api', {
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


    function matchApp(appId) {
        return pipelineData.find(element => element.id === appId)  
    }

    function handleRowClick(params) {
        setShowLoader(true)
        fetch(`http://localhost:8081/v0/run/api/${params.row.id}`, {
            headers: {'Authorization': `Basic ${credentials}`}
        })
            .then((r) => r.json())
            .then((data) => setSingleRun(data.tags), setShowLoader(false))
    }


    rows = runsData.map((run) => {
        return (
            { 
                id: run.id, 
                name: run.name, 
                status: run.status, 
                app: run.app, 
                pipeline: matchApp(run.app).name,
                createdDate: run.created_date,
                request: run.request_id,
                tags: singleRun.igoRequestId
            }
        )
    })






    const columns = [
        { field: 'id', headerName: 'ID', width: 70, hide: true },
        { field: 'tags', headerName: 'Tags', width: 70, hide: true },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'status', headerName: 'Status', width: 125 },
        { field: 'request', headerName: 'Request', width: 100 },
        { field: 'pipeline', headerName: 'Pipeline', width: 250 },
        {
          field: 'app',
          headerName: 'App',
          sortable: false,
          width: 250
        },
        {
          field: 'createdDate',
          headerName: 'Date Created',
          width: 250
        },
    ];

    if (runsData !== []) {
        return (
            <>
                {showLoader ? <LinearIndeterminate /> : ''}
                <SingleSelectTable 
                    columns={columns} 
                    rows={rows} 
                    handleRowClick={handleRowClick}
                />
                {singleRun && <Alert severity="info">{singleRun.igoRequestId}</Alert>}

            </>
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