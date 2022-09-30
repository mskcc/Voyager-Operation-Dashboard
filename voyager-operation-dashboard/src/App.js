import './App.css';
// import { Route, Routes, useNavigate } from "react-router-dom";
// import Dashboard from './pages/dashboard/Dashboard';
import Runs from './pages/runs/Runs';
import { AppBar } from '@mui/material';
import Dashboard from './pages/dashboard/Dashboard';
import Files from './pages/files/Files';


function App() {
  return (
    <div className="App">
      <Files />
    </div>
  );
}

export default App;
