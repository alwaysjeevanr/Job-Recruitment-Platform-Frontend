import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forms.css'; // For general form styling
import '../components/RecentJobList.css'; // For card styling, if needed

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [employerId, setEmployerId] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await API.get(`/jobs/${jobId}`);
        setJob(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job details.');
        toast.error(err.response?.data?.message || 'Failed to fetch job details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserApplications = async (token) => {
      try {
        const response = await API.get('/jobseeker/applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data?.success && Array.isArray(response.data?.data)) {
          const applications = response.data.data;
          const applied = applications.some(app => app.job && app.job._id === jobId);
          setHasApplied(applied);
        } else {
          console.error('Unexpected response format for user applications:', response.data);
          setHasApplied(false); // Assume not applied if format is unexpected
        }
      } catch (err) {
        console.error('Error fetching user applications:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch your application status.');
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        if (payload.role === 'employer') {
          setEmployerId(payload.id || payload._id || payload.userId);
        }
        if (payload.role === 'jobseeker') {
          fetchUserApplications(token);
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('token');
        setUserRole(null);
      }
    }

    fetchJobDetails();
  }, [jobId, navigate, userRole]);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success';
      case 'closed':
        return 'bg-danger';
      case 'filled':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  };

  const handleApplyClick = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.info('Please login to apply for jobs.');
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.role === 'jobseeker' && job.status.toLowerCase() === 'active' && !hasApplied) {
        navigate(`/jobs/${jobId}/apply`);
      } else if (payload && payload.role === 'employer') {
        toast.warning('Employers cannot apply for jobs.');
        navigate('/dashboard');
      } else if (job.status.toLowerCase() !== 'active') {
        toast.warning('This job is no longer active and cannot be applied for.');
      } else if (hasApplied) {
        toast.info('You have already applied for this job.');
      } else {
        toast.warning('You must be a job seeker to apply for jobs.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (err) {
      console.error('Error processing token for Quick Apply:', err);
      toast.error('Invalid session. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading job details...</p>
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

  if (!job) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-info">Job not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="d-flex justify-content-start mb-3">
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-2"></i> Back to Jobs
            </button>
          </div>
          <div className="card shadow-lg job-detail-card">
            <div className="card-body p-4 p-md-5">
              <h2 className="card-title text-center mb-4 emphasized-text-color">{job.title}</h2>
              <div className="text-center mb-4">
                <span className={`badge ${getStatusBadgeClass(job.status)} fs-6 me-2`}>
                  Status: {job.status}
                </span>
                <span className="badge bg-info text-dark fs-6">
                  Type: {job.type}
                </span>
              </div>

              <div className="mb-4">
                <h5 className="emphasized-text-color">Description</h5>
                <p className="text-muted">{job.description}</p>
              </div>

              <div className="mb-4">
                <h5 className="emphasized-text-color">Requirements</h5>
                <p className="text-muted">{job.requirements}</p>
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <h5 className="emphasized-text-color"><i className="bi bi-geo-alt-fill me-2"></i>Location</h5>
                  <p className="text-muted">{job.location}</p>
                </div>
                <div className="col-md-6">
                  <h5 className="emphasized-text-color"><i className="bi bi-currency-dollar me-2"></i>Salary</h5>
                  <p className="text-muted">{job.salary}</p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <h5 className="emphasized-text-color"><i className="bi bi-briefcase-fill me-2"></i>Experience Level</h5>
                  <p className="text-muted">{job.experience}</p>
                </div>
                <div className="col-md-6">
                  <h5 className="emphasized-text-color"><i className="bi bi-calendar-event-fill me-2"></i>Posted On</h5>
                  <p className="text-muted">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="emphasized-text-color"><i className="bi bi-tools me-2"></i>Required Skills</h5>
                <div className="d-flex flex-wrap gap-2">
                  {job.skills && job.skills.map((skill, index) => (
                    <span key={index} className="badge bg-primary skill-badge-detail">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center mt-5">
                {userRole === 'jobseeker' && (
                  <button
                    className="btn btn-primary btn-lg custom-apply-btn"
                    onClick={handleApplyClick}
                    disabled={hasApplied || job.status.toLowerCase() !== 'active'}
                  >
                    {hasApplied ? 'Already Applied' : 'Apply Now'}
                  </button>
                )}
                {userRole === 'employer' && employerId && (job.employer === employerId || job.employerId === employerId) && (
                  <button
                    className="btn btn-info btn-lg custom-apply-btn"
                    onClick={() => navigate(`/applicants`)}
                  >
                    View Applicants
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

export default JobDetails; 