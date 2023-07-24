import "./App.css";
import Navigation from "./pages/navigation/Navigation";
import Runs from "./pages/runs/Runs";
import Files from "./pages/files/Files";
import LoginPage from "./pages/login/Login";
import Protected from "./components/common/Protected";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
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
