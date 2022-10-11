import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Runs from './pages/runs/Runs';
import Files from './pages/files/Files';
// import { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';


function App() {

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
