import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Decode the JWT token (it's in the format: header.payload.signature)
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Invalid session. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handlePostJob = () => {
    navigate('/post-job');
  };

  const handleViewJobs = () => {
    navigate('/jobs');
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Dashboard</h2>
              
              <div className="text-center mb-4">
                <h4>Welcome, {userRole === 'employer' ? 'Employer' : 'Job Seeker'}!</h4>
              </div>

              <div className="d-grid gap-3">
                {userRole === 'employer' ? (
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handlePostJob}
                  >
                    Post a Job
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleViewJobs}
                  >
                    View Jobs
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 