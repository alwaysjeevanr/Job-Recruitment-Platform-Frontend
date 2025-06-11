import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import PostJob from './pages/PostJob';
import ApplyJob from './pages/ApplyJob';
import Applications from './pages/Applications';
import Welcome from './pages/Welcome';
import JobDetails from './pages/JobDetails';
import EmployerJobPosts from './pages/EmployerJobPosts';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column w-100">
        <Navbar />
        <main className="flex-grow-1 w-100">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
            <Route 
              path="/employer/jobs" 
              element={
                <ProtectedRoute>
                  <EmployerJobPosts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post-job" 
              element={
                <ProtectedRoute>
                  <PostJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs/:jobId/apply" 
              element={
                <ProtectedRoute>
                  <ApplyJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
