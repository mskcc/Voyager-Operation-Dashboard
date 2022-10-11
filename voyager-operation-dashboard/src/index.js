import React from 'react';
// import { render } from "react-dom"
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
// import Runs from './pages/runs/Runs';
// import Files from './pages/files/Files'
// import { BrowserRouter, Routes, Route } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// const rootElement = document.getElementById("root");
// render(
//   <BrowserRouter>
//     <Routes>
//       <Route path='/' element={<App />} />
//       <Route path='/runs' element={<Runs />} />
//       <Route path='/files' element={<Files />} />
//     </Routes>
//   </BrowserRouter>,
//   rootElement
// );
