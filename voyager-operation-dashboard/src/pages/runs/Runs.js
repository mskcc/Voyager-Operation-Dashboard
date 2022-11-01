import { useEffect, useState } from "react"
import './Runs.css'
import LinearIndeterminate from "../../components/loaders/LinearIndeterminate"
import SingleSelectTable from "../../components/tables/SingleSelectTable"
// import Dashboard from "../dashboard/Dashboard"

function Runs() {

    const [runsData, setRunsData] = useState([])
    const [singleRun, setSingleRun] = useState('')
    const [multRun, setMultRun] = useState([])
    const [runsId, setRunsId] = useState([])
    const [pipelineData, setPipelineData] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const credentials = btoa("admin:correctHorseBatteryStaple")

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

    // function handleRowClick(params) {
    //     setShowLoader(true)
    //     fetch(`http://localhost:8081/v0/run/api/${params.row.id}`, {
    //         headers: {'Authorization': `Basic ${credentials}`}
    //     })
    //         .then((r) => r.json())
    //         .then((data) => setSingleRun(data.tags), setShowLoader(false))
    // }

    function handleRowClick(params) {
        // setShowLoader(true)
        // console.log(params)
        setMultRun([])
        for (let i = 0; i < params.length; i++) {
            fetch(`http://localhost:8081/v0/run/api/${params[i]}`, {
            headers: {'Authorization': `Basic ${credentials}`}
        })
            .then((r) => r.json())
            .then((data) => setMultRun(multRun => [...multRun, data]))
        }
    }
    



    // console.log(singleRun)
    // if (singleRun.igoRequestId) {
    //     setMultRun(multRun.concat(singleRun.igoRequestId))
    // }


    const rows = runsData.map((run) => {
        // console.log(run)
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
    
    // const key = 'id';

    const filterId = [...new Map(multRun.map(run =>
    [run['id'], run])).values()];

    const requestRows = filterId.map((run) => {
        return (
            {
                id: run.id,
                name: run.name,
                request: run.tags.igoRequestId
            }
        )
    })

    // let myMap = new Map()

    // let uniqueRequestRow = multRun.filter(run => {
    //     const val = myMap.get(run.id)
    //     if(val) {
    //         if(run.id === val) {
    //             myMap.delete(run.id)
    //             myMap.set('id', run.id, 'name', run.name, 'request', run.tags.igoRequestId)
    //             console.log(myMap)
    //         } else {
    //             return false
    //         }
    //     }
    // })

    const requestColumns = [
        { field: 'id', headerName: 'ID', width: 250, hide: false },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'request', headerName: 'Request', width: 250 }
    ]






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
                <div className="runs-tables-container">
                    <SingleSelectTable 
                        columns={columns} 
                        rows={rows} 
                        // handleRowClick={handleRowClick}
                        selection={(ids) => handleRowClick(ids)}
                    />
                    <SingleSelectTable
                        columns={requestColumns}
                        rows={requestRows}
                    />
                </div>
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