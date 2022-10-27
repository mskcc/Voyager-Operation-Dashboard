import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Runs from './pages/runs/Runs';
import Files from './pages/files/Files';
import { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import axios from 'axios';


function App() {
  const [jobData, setJobData] = useState([])

  const userInput = {
    uuid: "32c38d5b-bb4e-4a26-8ca4-5de4af5267dd",
    job_files: [":)"],
  };
  
  useEffect(() => {
    function getJobData() {
      // Get requests
      axios
        .get("http://localhost:8000/api/jobs/", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
        .then(({data}) => {
          setJobData(data);
      });  
    }
    getJobData()
  }, [])

  function postJobRequest() {
    // Post requests
    axios
      .post("http://localhost:8000/api/jobs/", userInput, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then(({data}) => {
        console.log(data);
    });
  }

  function patchJobRequest() {
  // Patch requests
    axios.patch(`http://localhost:8000/api/jobs/${userInput.uuid}/`, {
        job_files: userInput.job_files,
      },
      { headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            }, }
        ).then((response) => {
          console.log(response)
        }).catch((error) => {
          console.log(error)
        })
  }

  // If the uuid already exists in the database, create a new model
  // Otherwise, update the uuid with job files from the user input
  let jobObj = {}
  for(let i = 0; i < jobData.length; i++ ) {
    jobObj[jobData[i].uuid] = jobData[i].job_files
  }

  if (jobObj !== {}) {
    if (userInput.uuid in jobObj) {
      patchJobRequest()
    } else if (userInput.uuid in jobObj === false) {
      postJobRequest()
    }
  }

  console.log(jobObj)

    

  return (
    <div className="App">
      <BrowserRouter>
      <Dashboard />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/runs' element={<Runs />} />
          <Route path='/files' element={<Files />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
