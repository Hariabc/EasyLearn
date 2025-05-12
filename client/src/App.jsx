import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/Logins/Signin";
import HeroSection16 from "./components/Navbar";
import FeatureSection from "./components/Sample";
import CoursesPage from "./pages/CoursesPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return <>
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection16/>}></Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  </>
}

export default App;
