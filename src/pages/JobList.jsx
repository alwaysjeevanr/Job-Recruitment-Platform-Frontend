import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/RecentJobList.css';
import '../styles/forms.css';
import MultiFieldSearchBar from '../components/MultiFieldSearchBar';

const JobList = () => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const searchTerm = params.get('search') || '';
        const locationParam = params.get('location') || '';
        const experienceParam = params.get('experience') || '';

        const query = new URLSearchParams({
          ...(searchTerm && { search: searchTerm }),
          ...(locationParam && { location: locationParam }),
          ...(experienceParam && { experience: experienceParam }),
        }).toString();

        const response = await API.get(`/jobs?${query}`);

        if (response.data?.success && response.data?.data?.jobs) {
          setFilteredJobs(response.data.data.jobs);
        } else {
          console.error('Unexpected response format for jobs list:', response.data);
          toast.error('Failed to load jobs due to unexpected data format.');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('token');
        setUserRole(null);
      }
    }

    fetchJobs();
  }, [location.search]);

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

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i> Back
        </button>
      </div>
      <MultiFieldSearchBar />
      {filteredJobs.length === 0 ? (
        <div className="text-center mt-4">
          <h4>No jobs found</h4>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredJobs.map(job => (
            <div key={job._id} className="col">
              <div 
                className="card h-100 job-card" 
                onClick={() => navigate(`/jobs/${job._id}`)}
                style={{ cursor: 'pointer' }}
              >
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
                  {userRole !== 'employer' && (
                    <button 
                      className="btn btn-primary w-100 apply-btn"
                      onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job._id}/apply`); }}
                    >
                      <i className="bi bi-lightning-fill me-1"></i> Apply Now
                    </button>
                  )}
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

export default JobList; 