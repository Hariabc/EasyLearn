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
import DSA from "./Courses/DSA/DSA";
import FrontEndTopics from "./Courses/FrontEnd/FrontendTopics";
import Frontend from "./Courses/FrontEnd/FrontEnd";
import BackEnd from "./Courses/Backend/BackEnd";
import BackEndTopics from "./Courses/Backend/BackEndTopics";
import Aptitude from "./Courses/Aptitude/Aptitude";
import AptitudeTopics from "./Courses/Aptitude/AptitudeTopics";
import DSATopics from "./Courses/DSA/DSATopics";
import MyCourses from "./pages/MyCourses";
import BadgeComponent from "./components/BadgeCard";
import StreakDisplay from "./components/StreakDisplay";
import CodeEditor from "./pages/CodeEditor";
import ResetPassword from "./components/Logins/ResetPassword";

function App() {
  return <>
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection16 />}></Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/my-courses" element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        } />

        <Route path="/courses" element={
          <ProtectedRoute>
            <CoursesPage />
          </ProtectedRoute>
        } />

        <Route path="/codeeditor" element={
          <ProtectedRoute>
            <CodeEditor />
          </ProtectedRoute>
        } />

        <Route path="/my-badges" element={
          <ProtectedRoute>
            <BadgeComponent />
          </ProtectedRoute>
        } />

        <Route path="/courses/computerlanguages" element={
          <ProtectedRoute>
            <ComputerLanguages />
          </ProtectedRoute>
        } />

        <Route path="/courses/computerlanguages/:languageId" element={
          <ProtectedRoute>
            <LanguageTopics />
          </ProtectedRoute>
        } />

        <Route path="/courses/computerlanguages/:languageId/:topic" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />

        <Route path="/courses/frontend" element={
          <ProtectedRoute>
            <Frontend />
          </ProtectedRoute>
        } />

        <Route path="/courses/frontend/:languageId" element={
          <ProtectedRoute>
            <FrontEndTopics />
          </ProtectedRoute>
        } />

        <Route path="/courses/frontend/:languageId/:topic" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />


        <Route path="/courses/backend" element={
          <ProtectedRoute>
            <BackEnd />
          </ProtectedRoute>
        } />

        <Route path="/courses/backend/:languageId" element={
          <ProtectedRoute>
            <BackEndTopics />
          </ProtectedRoute>
        } />

        <Route path="/courses/backend/:languageId/:topic" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />

        <Route path="/courses/aptitude" element={
          <ProtectedRoute>
            <Aptitude />
          </ProtectedRoute>
        } />

        <Route path="/courses/aptitude/:languageId" element={
          <ProtectedRoute>
            <AptitudeTopics />
          </ProtectedRoute>
        } />

        <Route path="/courses/aptitude/:languageId/:topic" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />

        <Route
          path="/courses/dsa" element={
            <ProtectedRoute>
              <DSA />
            </ProtectedRoute>
          }
        />

        <Route path="/courses/dsa/:languageId" element={
          <ProtectedRoute>
            <DSATopics />
          </ProtectedRoute>
        }
        />

        <Route
          path="/courses/dsa/:languageId/:topic"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/streak" element={<StreakDisplay />} />
      </Routes>
    </Router>
  </>
}

export default App;
