import React from 'react';
import { render } from "react-dom"
import './index.css';
import App from './App';
import Runs from './pages/runs/Runs';
import Files from './pages/files/Files'
import { BrowserRouter, Routes, Route } from "react-router-dom";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/runs' element={<Runs />} />
      <Route path='/files' element={<Files />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
