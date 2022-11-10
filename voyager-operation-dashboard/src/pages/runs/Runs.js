import { useEffect, useState } from "react"
import './Runs.css'
import ControlledPopup from "../../components/popups/ControlledPopup"
import LinearIndeterminate from "../../components/loaders/LinearIndeterminate"
import SingleSelectTable from "../../components/tables/SingleSelectTable"
// import Dashboard from "../dashboard/Dashboard"
import axios from 'axios';
import { Alert } from "@mui/material";
import Popup from 'reactjs-popup';
import Link from "@mui/material";

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

    // Request Table
    const [jobData, setJobData] = useState([])


    function getJobData() {
        // Get requests
        axios
            .get(`http://localhost:8000/api/jobs/`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            })
            .then(({data}) => {setJobData(data);});  
        }

    function postJobRequest(jobId) {
        // Post requests
        axios
        .post("http://localhost:8000/api/jobs/", jobId, {
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            },
        })
    }

    function patchJobRequest(jobId) {
    // Patch requests
        axios
        .patch(`http://localhost:8000/api/jobs/${jobId.uuid}/`, {
            job_files: jobId.job_files,
        },
        { headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                }, }
            )
    }
    
    useEffect(() => {
        getJobData()
    }, [])

    function requestJob(jobId) {
        getJobData()
        //   Construct the array of objects from the database into a single object
        let jobObj = {}
        for(let i = 0; i < jobData.length; i++ ) {
            jobObj[jobData[i].uuid] = jobData[i].job_files
        }
        //   If the uuid already exists in the database, display files
        //   Otherwise, display nothing.
        if (jobObj !== {}) {
            if (jobId in jobObj) {
                return {"uuid":jobId, "job_files":jobObj[jobId]}
            } else {
                return {"uuid":jobId, "job_files":["No files"]}
            } 
        }  
    }

    function rowData(data) {
        data["job_files"] = requestJob(data.id)
        setMultRun(multRun => [...multRun, data])
    }


    function handleRowClick(params) {
        // setShowLoader(true)
        // console.log(params)
        setMultRun([])
        for (let i = 0; i < params.length; i++) {
            fetch(`http://localhost:8081/v0/run/api/${params[i]}`, {
            headers: {'Authorization': `Basic ${credentials}`}
        })
            .then((r) => r.json())
            // .then((data) => setMultRun(multRun => [...multRun, data]))
            .then((data) => rowData(data))
        }
    }
    

    // Filter out duplicate rows based on uuid
    const filterId = [...new Map(multRun.map(run =>
        [run['id'], run])).values()];
    
    const requestRows = filterId.map((run) => {
        return (
            {
                id: run.id,
                name: run.name,
                request: run.tags.igoRequestId,
                files: run.job_files.job_files
            }
        )
    })
    

    const requestColumns = [
        { field: 'id', headerName: 'ID', width: 250, hide: false },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'request', headerName: 'Request', width: 250 },
        // { field: 'files', headerName: 'Files', width: 250 },
        {
            field: 'files',
            headerName: 'Files',
            width: 350,
            // Need to map this!
            renderCell: (cellValues) => {
                //   return <button onClick={}>{cellValues.row.files}</button>;
                  return <ControlledPopup name={'filename'} content={cellValues.row.files}/>;
            }

            // renderCell: (cellValues) => {cellValues.row.files.map((file) => {
            // //   return <button onClick={}>{cellValues.row.files}</button>;
            //   return <ControlledPopup name={'filename'} content={file}/>;
            // })
            // }
        }
    ]

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
                        // selection={(ids) => console.log(ids)}
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