import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/Logins/Signin";
import HeroSection16 from "./components/Navbar";
import FeatureSection from "./components/Sample";
import CoursesPage from "./pages/CoursesPage";

function App() {
  return <>
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection16/>}></Route>
        <Route path="/login" element={<SignIn />} />
      </Routes>
    </Router>
  </>
}

export default App;
