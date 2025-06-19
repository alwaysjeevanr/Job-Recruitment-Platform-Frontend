import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios'; // Assuming API is configured for authenticated requests
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forms.css'; // Import common forms styling

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [applications, setApplications] = useState([]); // New state for applications
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchEmployerApplications = async (role) => {
      if (role === 'employer') {
        try {
          const response = await API.get('/applications/employer', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data?.success && response.data?.data) {
            setApplications(response.data.data);
          } else {
            console.error('Unexpected response format for employer applications:', response.data);
            setError('Failed to load employer applications due to unexpected data format.');
          }
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to fetch applications.');
          setError(err.response?.data?.message || 'Failed to fetch applications.');
        }
      } else if (role === 'jobseeker') { 
        try {
          const response = await API.get('/applications/jobseeker', { 
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data?.success && response.data?.data) {
            setApplications(response.data.data);
          } else {
            console.error('Unexpected response format for jobseeker applications:', response.data);
            setError('Failed to load jobseeker applications due to unexpected data format.');
          }
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to fetch your applications.');
          setError(err.response?.data?.message || 'Failed to fetch your applications.');
        }
      }
    };

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.role) {
        setUserRole(payload.role);
        fetchEmployerApplications(payload.role); 
      } else {
        console.error('Role not found in token payload');
        setError('Invalid session token.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Invalid session. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.put(`/applications/${applicationId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.success) {
        toast.success('Application status updated successfully!');
        setApplications(prevApplications => 
          prevApplications.map(app => 
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        toast.error(response.data?.message || 'Failed to update status due to unexpected response.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

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

  if (!userRole) {
     return null;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card form-container-card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4 form-title">Dashboard</h2>
              
              <div className="text-center mb-4">
                <h4>Welcome, {userRole === 'employer' ? 'Employer' : 'Job Seeker'}!</h4>
              </div>

              {userRole === 'employer' ? (
                <>
                  <h3 className="card-title text-center mb-4">Applicants for Your Jobs</h3>
                  <div className="d-flex justify-content-center gap-2 mb-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/post-job')}
                    >
                      <i className="bi bi-plus-circle me-2"></i> Post a New Job
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/jobs')}
                    >
                      <i className="bi bi-search me-2"></i> Browse All Jobs
                    </button>
                  </div>
                  {applications.length === 0 ? (
                    <div className="alert alert-info text-center">
                      No applicants yet for your posted jobs.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-striped align-middle">
                        <thead>
                          <tr>
                            <th>Applicant Name</th>
                            <th>Job Title</th>
                            <th>Applied On</th>
                            <th>Status</th>
                            <th>Resume</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map(app => (
                            <tr key={app._id}>
                              <td className="align-middle">{app.applicant ? app.applicant.name : 'N/A'}</td>
                              <td className="align-middle">{app.job ? app.job.title : 'N/A'}</td>
                              <td className="align-middle">{new Date(app.appliedAt).toLocaleDateString()}</td>
                              <td className="align-middle">
                                <select
                                  className={`form-select form-select-sm ${
                                    app.status === 'pending' ? 'bg-warning text-dark' :
                                    app.status === 'accepted' ? 'bg-success text-white' :
                                    app.status === 'rejected' ? 'bg-danger text-white' :
                                    ''
                                  }`}
                                  value={app.status}
                                  onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </td>
                              <td className="align-middle">
                                {app.resumeLink ? (
                                  <a
                                    href={app.resumeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-info"
                                  >
                                    <i className="bi bi-eye me-2"></i> View Resume
                                  </a>
                                ) : (
                                  <span className="text-muted">N/A</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="card-title text-center mb-4">Your Applications</h3>
                  <div className="d-flex justify-content-center gap-2 mb-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/jobs')}
                    >
                      <i className="bi bi-plus-circle me-2"></i> Apply for Jobs
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/jobs')}
                    >
                      <i className="bi bi-search me-2"></i> Search Jobs
                    </button>
                  </div>
                  {applications.length === 0 ? (
                    <div className="alert alert-info text-center">
                      You haven't applied to any jobs yet.
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
                          {applications.map(app => (
                            <tr key={app._id}>
                              <td className="align-middle">{app.job ? app.job.title : 'N/A'}</td>
                              <td className="align-middle">{new Date(app.appliedAt).toLocaleDateString()}</td>
                              <td className="align-middle">
                                <span className={`badge ${
                                  app.status === 'pending' ? 'bg-warning text-dark' :
                                  app.status === 'accepted' ? 'bg-success' :
                                  app.status === 'rejected' ? 'bg-danger' :
                                  'bg-secondary'
                                }`} style={{ textTransform: 'capitalize', padding: '0.5em 1em' }}>{app.status}</span>
                              </td>
                              <td className="align-middle">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => navigate(`/jobs/${app.job?._id}`)}
                                  disabled={!app.job?._id}
                                >
                                  <i className="bi bi-eye me-1"></i> View Job
                                </button>
                              </td>
                              <td className="align-middle">
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteApplication(app._id)}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 