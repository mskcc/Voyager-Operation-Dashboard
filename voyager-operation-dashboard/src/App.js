import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Runs from './pages/runs/Runs';
import Files from './pages/files/Files';
// import { useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import axios from 'axios';


function App() {

  const data = {
    uuid: "4b178c1c-53ad-11ed-bdc3-0242ac120002",
    job_files: ["Python is cool!"],
  };

  axios
    .post("http://localhost:8000/api/jobs/", data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
    .then(({data}) => {
      console.log(data);
  });
    

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
