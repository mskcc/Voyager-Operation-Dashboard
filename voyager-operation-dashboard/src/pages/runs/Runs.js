import { useEffect, useState } from "react"
import './Runs.css'
import LinearIndeterminate from "../../components/loaders/LinearIndeterminate"
import MultiSelectTable from "../../components/tables/MultiSelectTable"
import SingleRowSelectTable from "../../components/tables/SingleRowSelectTable"
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import JobFiles from "./JobFiles"
import { TextField } from '@mui/material';

function Runs() {

    const [runsData, setRunsData] = useState([])
    const [singleRun, setSingleRun] = useState('')
    const [multRun, setMultRun] = useState([])
    const [pipelineData, setPipelineData] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const credentials = btoa("admin:correctHorseBatteryStaple")

    useEffect(() => {
        function fetchRunData() {
            fetch('http://localhost:8081/v0/run/api?page_size=10000', {
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
        
        return (
            { 
                id: run.id, 
                name: run.name, 
                status: run.status, 
                app: run.app, 
                pipeline: matchApp(run.app).name,
                createdDate: run.created_date,
                request: run.request_id,
            }
        )
    })
    
    const columns = [
        { field: 'id', headerName: 'ID', width: 70, hide: true },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'status', headerName: 'Status', width: 125 },
        { field: 'request', headerName: 'Request', width: 100 },
        { field: 'pipeline', headerName: 'Pipeline', width: 375 },
        {
          field: 'app',
          headerName: 'App',
          sortable: false,
          width: 250,
          hide: true
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

    function runSubmit(payload) {
        axios
        .post("http://localhost:8081/v0/run/operator/runs/", payload, {
            headers: {
            'Authorization': `Basic ${credentials}`
            },
        })
        .then(response => console.log(response))
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


    // Add job files data to the object from the pipeline table
    function rowData(data) {
        data["job_files"] = requestJob(data.job_group)
        setMultRun(multRun => [...multRun, data])
    }


    function handleRowClick(params) {
        // setShowLoader(true)
        setMultRun([])
        for (let i = 0; i < params.length; i++) {
            fetch(`http://localhost:8081/v0/run/api/${params[i]}`, {
            headers: {'Authorization': `Basic ${credentials}`}
        })
            .then((r) => r.json())
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
        { field: 'id', headerName: 'ID', width: 250, hide: true },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'request', headerName: 'Request', width: 250 },
        {
            field: 'files',
            headerName: 'Files',
            width: 350,
            hide: true
        }
    ]

    // Pass the file array to the Modal
    const [selectedFileRows, setSelectedFileRows] = useState([{"files":[{}]}]);
    const [showFile, setShowFile] = useState(false)

    const handleClose = () => setShowFile(false);
    const handleShow = () => setShowFile(true);

    function selectFiles(selected) {
        // Prevents an empty array from being passed to the Modal
        // when the checkboxes are edited in the main table
        if (selected.length > 0) {
            handleShow()
            setSelectedFileRows(selected)
        }
    }

    // Submit run
    const [pipeName, setPipeName] = useState("")
    const [pipeVersion, setPipeVersion] = useState("")

    
    function handleSubmit(event, requestRows) {
            event.preventDefault();
            alert(`${pipeName} \n ${pipeVersion}`);

            let runIds = []
            
            const reqMap = requestRows.map((rows) => ({
                "request": rows["request"]
            }))

            for (let i in reqMap) {
                runIds = [...runIds, reqMap[i]["request"]]
            }

            const payload = {
                'run_ids': runIds,
                'pipelines': [pipeName],
                'pipeline_versions': [pipeVersion],
                "job_group_id": null,
                "for_each": false
            }
            // runSubmit(payload)
    }

    

    if (runsData !== []) {
        return (
            <>
                {showLoader ? <LinearIndeterminate /> : ''}
                <div className="runs-tables-container">
                    <MultiSelectTable 
                        columns={columns} 
                        rows={rows}
                        selection={(ids) => handleRowClick(ids)}
                    />

                    <SingleRowSelectTable
                        columns={requestColumns}
                        rows={requestRows}
                        selection={ (ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = requestRows.filter((row) =>
                                selectedIDs.has(row.id),
                                );
                                
                                // Pass files to the Modal
                                selectFiles(selectedRows)
                            }
                        }
                    />

                </div> 

                <form onSubmit={(e) => handleSubmit(e, requestRows)} className="pipeline-submit">
                        <TextField
                            value={pipeName}
                            label="Pipeline Name"
                            onChange={(e) => {
                                setPipeName(e.target.value);
                            }}
                        />
                        <TextField
                            value={pipeVersion}
                            label="Pipeline Version"
                            onChange={(e) => {
                                setPipeVersion(e.target.value);
                            }}
                        />
                        <Button type="submit" className="pipeline-submit-button">Submit</Button>
                    </form>

                <div> 
                    <Modal show={showFile} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedFileRows[0].name} Files</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <JobFiles 
                                files = {selectedFileRows[0].files[0]}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        {/* <Button variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button> */}
                        </Modal.Footer>
                    </Modal>
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
