import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/Logins/Signin";
import SignUp from "./components/Logins/Signup";
import HeroSection16 from "./components/Navbar";
import FeatureSection from "./components/Sample";
import CoursesPage from "./pages/CoursesPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import ComputerLanguages from "./Courses/ComputerLangugages/ComputerLanguages";
import LanguageTopics from "./Courses/ComputerLangugages/ComputerLanguageTopics";
import CourseDetail from "./Courses/CourseDetails";
import DSACourses from "./Courses/DSA/DSACourses";
import FrontEndTopics from "./Courses/FrontEnd/FrontendTopics";
import Frontend from "./Courses/FrontEnd/FrontEnd";
import BackEnd from "./Courses/Backend/BackEnd";
import BackEndTopics from "./Courses/Backend/BackEndTopics";
import Aptitude from "./Courses/Aptitude/Aptitude";
import AptitudeTopics from "./Courses/Aptitude/AptitudeTopics";


function App() {
  return <>
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection16/>}></Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/> 
            </ProtectedRoute>
          } />
          <Route path="/courses/computerlanguages" element={
            <ProtectedRoute>
              <ComputerLanguages />
            </ProtectedRoute>
          } />
          <Route path="/courses/computerlanguages/:language" element={
            <ProtectedRoute>
              <LanguageTopics/>
            </ProtectedRoute>
          } />
          <Route path="/courses/computerlanguages/:language/:topic" element={
            <ProtectedRoute>
              <CourseDetail />
              </ProtectedRoute>
          } />



           <Route path="/courses/frontend" element={
            <ProtectedRoute>
              <Frontend/>
            </ProtectedRoute>
          } />

          <Route path="/courses/frontend/:language" element={
            <ProtectedRoute>
             <FrontEndTopics/>
            </ProtectedRoute>
          } />

          <Route path="/courses/frontend/:language/:topic" element={
            <ProtectedRoute>
              <CourseDetail />
              </ProtectedRoute>
          } />


          <Route path="/courses/backend" element={
            <ProtectedRoute>
              <BackEnd/>
            </ProtectedRoute>
          } />

          <Route path="/courses/backend/:language" element={
            <ProtectedRoute>
             <BackEndTopics/>
            </ProtectedRoute>
          } />

          <Route path="/courses/backend/:language/:topic" element={
            <ProtectedRoute>
              <CourseDetail />
              </ProtectedRoute>
          } />



          <Route path="/courses/aptitude" element={
            <ProtectedRoute>
              <Aptitude/>
            </ProtectedRoute>
          } />

          <Route path="/courses/aptitude/:language" element={
            <ProtectedRoute>
             <AptitudeTopics/>
            </ProtectedRoute>
          } />

          <Route path="/courses/aptitude/:language/:topic" element={
            <ProtectedRoute>
              <CourseDetail />
              </ProtectedRoute>
          } />




          <Route
          path="/courses/dsa"
          element={
            <ProtectedRoute>
              <DSACourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/dsa/:topic"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </>
}

export default App;
