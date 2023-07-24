import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Runs from "./pages/runs/Runs";
import Files from "./pages/files/Files";
import LoginPage from "./pages/login/Login";
import Protected from "./components/common/Protected";
import { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import axios from "axios";

function App() {
  // const [jobData, setJobData] = useState([])

  // const userInput = {
  //   uuid: "7b8ffa66-d4ab-419b-8181-b1290e009d39",
  //   job_files: ["Insert file path here!"],
  // };

  // useEffect(() => {
  //   function getJobData() {
  //     // Get requests
  //     axios
  //       .get("http://localhost:8000/api/jobs/", {
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json;charset=UTF-8",
  //         },
  //       })
  //       .then(({data}) => {
  //         setJobData(data);
  //     });
  //   }
  //   getJobData()
  // }, [])

  // function postJobRequest() {
  //   // Post requests
  //   axios
  //     .post("http://localhost:8000/api/jobs/", userInput, {
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json;charset=UTF-8",
  //       },
  //     })
  // }

  // function patchJobRequest() {
  // // Patch requests
  //   axios.patch(`http://localhost:8000/api/jobs/${userInput.uuid}/`, {
  //       job_files: userInput.job_files,
  //     },
  //     { headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json;charset=UTF-8",
  //           }, }
  //       )
  // }

  // Construct the array of objects from the database into a single object
  // let jobObj = {}
  // for(let i = 0; i < jobData.length; i++ ) {
  //   jobObj[jobData[i].uuid] = jobData[i].job_files
  // }

  // If the uuid already exists in the database, update the uuid
  // with job files from the user input. Otherwise, create a job model.
  // if (jobObj !== {}) {
  //   if (userInput.uuid in jobObj) {
  //     patchJobRequest()
  //   } else {
  //     postJobRequest()
  //   }
  // }

  return (
    <div className="App">
      <BrowserRouter>
        <Dashboard />
        <Routes>
          <Route
            path="/"
            element={
              <Protected>
                <Home />
              </Protected>
            }
          />
          <Route
            path="/runs"
            element={
              <Protected>
                <Runs />
              </Protected>
            }
          />
          <Route
            path="/files"
            element={
              <Protected>
                <Files />
              </Protected>
            }
          />
          <Route path="/login" element={<LoginPage redirectRoute="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
