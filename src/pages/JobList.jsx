import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filterJobs = () => {
      if (!searchTerm.trim()) {
        setFilteredJobs(jobs);
        return;
      }

      const searchLower = searchTerm.toLowerCase();
      const filtered = jobs.filter(job => 
        job.location.toLowerCase().includes(searchLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
        job.title.toLowerCase().includes(searchLower)
      );
      setFilteredJobs(filtered);
    };

    filterJobs();
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await API.get('/jobs');
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by location, skill, or job title..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center mt-4">
          <h4>No jobs found</h4>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredJobs.map(job => (
            <div key={job._id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    <i className="bi bi-geo-alt"></i> {job.location}
                  </h6>
                  <p className="card-text">
                    {job.description.length > 150
                      ? `${job.description.substring(0, 150)}...`
                      : job.description}
                  </p>
                  <div className="mb-3">
                    <small className="text-muted">Required Skills:</small>
                    <div className="mt-1">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-primary me-1 mb-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate(`/jobs/${job._id}/apply`)}
                  >
                    Apply Now
                  </button>
                </div>
                <div className="card-footer text-muted">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
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