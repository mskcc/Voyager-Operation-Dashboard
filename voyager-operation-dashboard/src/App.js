import './App.css'
import Navigation from './pages/navigation/Navigation'
import Runs from './pages/runs/Runs'
import Files from './pages/files/Files'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home'

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/runs" element={<Runs />} />
                    <Route path="/files" element={<Files />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
