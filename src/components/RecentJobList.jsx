import { useState, useEffect } from 'react';
import API from '../axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './RecentJobList.css';

const RecentJobList = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await API.get('/jobs/recent');
        
        if (response.data?.success && response.data?.data?.jobs) {
          setRecentJobs(response.data.data.jobs);
        } else {
          console.error('Unexpected response format for recent jobs:', response.data);
          setError('Failed to load recent jobs due to unexpected data format.');
        }
      } catch (error) {
        console.error('Error fetching recent jobs:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch recent jobs. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentJobs();
  }, []);

  const handleQuickApply = (jobId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.info('Please login to apply for jobs.');
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload && payload.role === 'jobseeker') {
        navigate(`/jobs/${jobId}/apply`);
      } else {
        toast.warning('Only job seekers can apply for jobs.');
        if (payload && payload.role === 'employer') {
          navigate('/dashboard');
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('Error processing token for Quick Apply:', err);
      toast.error('Invalid session. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger shadow-sm">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            className="btn btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading recent jobs...</p>
      </div>
    );
  }

  if (recentJobs.length === 0) {
    return (
      <div className="text-center mt-5 py-5">
        <i className="bi bi-inbox display-1 text-muted"></i>
        <h4 className="mt-3">No recent jobs found</h4>
        <p className="text-muted">Check back later for new opportunities</p>
      </div>
    );
  }

  return (
    <div className="recent-jobs-container mt-4">
      <h3 className="section-title">
        <i className="bi bi-clock-history me-2"></i>
        Recent Job Listings
      </h3>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {recentJobs.map(job => (
          <div key={job._id} className="col">
            <div 
              className="card h-100 job-card" 
              onClick={() => navigate(`/jobs/${job._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <h5 className="card-title text-truncate">{job.title}</h5>
                <h6 className="card-subtitle mb-3 text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {job.location}
                </h6>
                <p className="card-text job-description">
                  {job.description.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description}
                </p>
                <div className="skills-container mb-3">
                  <small className="text-muted d-block mb-2">
                    <i className="bi bi-tools me-1"></i>
                    Required Skills:
                  </small>
                  <div className="skills-wrapper">
                    {job.skills && job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="badge me-1 mb-1 skill-badge"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  className="btn btn-primary w-100 apply-btn"
                  onClick={(e) => { e.stopPropagation(); handleQuickApply(job._id); }}
                >
                  <i className="bi bi-lightning-fill me-1"></i>
                  Quick Apply
                </button>
              </div>
              <div className="card-footer text-muted">
                <i className="bi bi-calendar-event me-1"></i>
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentJobList; 