import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forms.css';
import '../components/RecentJobList.css';
import { toast } from 'react-hot-toast';

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

        const response = await API.get('/jobseeker/applications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data?.success && response.data?.data) {
          setApplications(response.data.data);
        } else {
          console.error('Unexpected response format for applications:', response.data);
          setError('Failed to load applications due to unexpected data format.');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const token = localStorage.getItem('token');
        await API.delete(`/applications/${applicationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Application deleted successfully!');
        setApplications(prevApplications => prevApplications.filter(app => app._id !== applicationId));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete application.');
        console.error('Error deleting application:', err);
      }
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
      <div className="d-flex justify-content-start mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i> Back
        </button>
      </div>
      <h2 className="mb-4 form-title">My Applications</h2>
      
      {applications.length === 0 ? (
        <div className="alert alert-info text-center form-container-card p-4">
          You haven't applied to any jobs yet.
          <button 
            className="btn btn-primary ms-3 mt-3"
            onClick={() => navigate('/jobs')}
          >
            <i className="bi bi-search me-1"></i> Browse Jobs
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Job Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application._id}>
                  <td className="align-middle">{application.job ? application.job.title : 'N/A'}</td>
                  <td className="align-middle">{new Date(application.appliedAt).toLocaleDateString()}</td>
                  <td className="align-middle">
                    <span className={`badge ${
                      application.status === 'pending' ? 'bg-warning text-dark' :
                      application.status === 'accepted' ? 'bg-success' :
                      application.status === 'rejected' ? 'bg-danger' :
                      'bg-secondary'
                    }`} style={{ textTransform: 'capitalize', padding: '0.5em 1em' }}>{application.status}</span>
                  </td>
                  <td className="align-middle">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/jobs/${application.job?._id}`)}
                      disabled={!application.job?._id}
                    >
                      <i className="bi bi-eye me-1"></i> View Job
                    </button>
                  </td>
                  <td className="align-middle">
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteApplication(application._id)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications; 