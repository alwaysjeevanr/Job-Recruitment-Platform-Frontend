import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/applications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setApplications(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning';
      case 'accepted':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Applications</h2>
      
      {applications.length === 0 ? (
        <div className="alert alert-info">
          You haven't applied to any jobs yet.
          <button 
            className="btn btn-primary ms-3"
            onClick={() => navigate('/jobs')}
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="row">
          {applications.map(application => (
            <div key={application._id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{application.job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    <i className="bi bi-building"></i> {application.job.company}
                  </h6>
                  <p className="card-text">
                    <small className="text-muted">
                      Applied on {new Date(application.appliedAt).toLocaleDateString()}
                    </small>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                      {application.status}
                    </span>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/jobs/${application.job._id}`)}
                    >
                      View Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications; 