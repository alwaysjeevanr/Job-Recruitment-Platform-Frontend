import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forms.css';
import '../components/RecentJobList.css'; // For card styling

const EmployerJobPosts = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployerJobPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await API.get(`/jobs/employer/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data?.success && Array.isArray(response.data?.data)) {
          setJobPosts(response.data.data);
        } else {
          console.error('Unexpected response format for employer job posts:', response.data);
          setError('Failed to load your job posts due to unexpected data format.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your job posts.');
        toast.error(err.response?.data?.message || 'Failed to fetch your job posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerJobPosts();
  }, [navigate]);

  const handleStatusChange = async (jobId, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please log in.');
      navigate('/login');
      return;
    }

    try {
      const response = await API.put(`/jobs/${jobId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.success) {
        toast.success('Job status updated successfully!');
        setJobPosts(prevJobs =>
          prevJobs.map(job =>
            job._id === jobId ? { ...job, status: newStatus } : job
          )
        );
      } else {
        toast.error(response.data?.message || 'Failed to update job status due to unexpected response.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update job status.');
      console.error('Error updating job status:', err.response?.data || err.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success';
      case 'closed':
        return 'bg-danger';
      case 'draft':
        return 'bg-secondary'; // Assuming draft is grey
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your job posts...</p>
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
      <h2 className="mb-4 form-title">Your Posted Jobs</h2>

      {jobPosts.length === 0 ? (
        <div className="alert alert-info text-center form-container-card p-4">
          You haven't posted any jobs yet.
          <button
            className="btn btn-primary ms-3 mt-3"
            onClick={() => navigate('/post-job')}
          >
            <i className="bi bi-plus-circle me-1"></i> Post Your First Job
          </button>
        </div>
      ) : (
        <div className="row">
          {jobPosts.map(job => (
            <div key={job._id} className="col-md-6 mb-4">
              <div className="card h-100 job-card">
                <div className="card-body">
                  <h5 className="card-title text-truncate">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    <i className="bi bi-geo-alt"></i> {job.location}
                  </h6>
                  <p className="card-text job-description">
                    {job.description.length > 150
                      ? `${job.description.substring(0, 150)}...`
                      : job.description}
                  </p>
                  <div className="mb-3 skills-container">
                    <small className="text-muted">Required Skills:</small>
                    <div className="mt-1 skills-wrapper">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-primary me-1 mb-1 skill-badge"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                      Status: {job.status}
                    </span>
                    <select
                      className="form-select form-select-sm w-auto"
                      value={job.status}
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="card-footer text-muted">
                  <i className="bi bi-calendar-event me-1"></i> Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerJobPosts; 