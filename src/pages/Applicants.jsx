import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forms.css';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchEmployerApplications = async () => {
      try {
        const response = await API.get('/applications/employer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.success && response.data?.data) {
          setApplications(response.data.data);
        } else {
          setError('Failed to load employer applications due to unexpected data format.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployerApplications();
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
      <h2 className="mb-4 form-title text-center">Applicants for Your Jobs</h2>
      {applications.length === 0 ? (
        <div className="alert alert-info text-center">No applicants yet for your posted jobs.</div>
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
                      className="form-select form-select-sm"
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
    </div>
  );
};

export default Applicants; 