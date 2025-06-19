import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forms.css';
import { jwtDecode } from 'jwt-decode';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    skills: '',
    requirements: '',
    minSalary: '',
    maxSalary: '',
    currency: 'USD',
    type: '',
    experience: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please log in.');
      setLoading(false);
      navigate('/login');
      return;
    }

    let employerId = null;
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      if (decodedToken.role !== 'employer') {
        toast.error('Only employers can post jobs.');
        setLoading(false);
        return;
      }
      employerId = decodedToken.id;
    } catch {
      toast.error('Invalid authentication token.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        type: formData.type,
        experience: formData.experience,
        company: formData.company,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        requirements: formData.requirements,
        salary: formData.minSalary && formData.maxSalary
          ? `${formData.minSalary}-${formData.maxSalary} ${formData.currency}`
          : '',
        employerId: employerId,
      };

      console.log('Sending job data:', jobData);

      const response = await API.post('/jobs', jobData);

      if (response.data?.success) {
        toast.success('Job posted successfully!');

        setFormData({
          title: '',
          description: '',
          location: '',
          skills: '',
          requirements: '',
          minSalary: '',
          maxSalary: '',
          currency: 'USD',
          type: '',
          experience: '',
          company: ''
        });

        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      } else {
        toast.error(response.data?.message || 'Failed to post job due to unexpected response.');
      }
    } catch (error) {
      console.error('Error posting job:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card form-container-card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4 form-title">Post a Job</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Senior React Developer"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="company" className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Tech Solutions Inc"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Job Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Describe the job responsibilities and requirements..."
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g., New York, NY or Remote"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="skills" className="form-label">Required Skills</label>
                  <input
                    type="text"
                    className="form-control"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                    placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                  />
                  <div className="form-text">
                    Enter skills separated by commas
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="requirements" className="form-label">Job Requirements</label>
                  <textarea
                    className="form-control"
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="5"
                    placeholder="List detailed job requirements (comma-separated if multiple)..."
                  />
                  <div className="form-text">
                    Enter requirements separated by commas (if multiple)
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="minSalary" className="form-label">Min Salary</label>
                    <input
                      type="number"
                      className="form-control"
                      id="minSalary"
                      name="minSalary"
                      value={formData.minSalary}
                      onChange={handleChange}
                      placeholder="e.g., 80000"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="maxSalary" className="form-label">Max Salary</label>
                    <input
                      type="number"
                      className="form-control"
                      id="maxSalary"
                      name="maxSalary"
                      value={formData.maxSalary}
                      onChange={handleChange}
                      placeholder="e.g., 100000"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="currency" className="form-label">Currency</label>
                    <input
                      type="text"
                      className="form-control"
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      required
                      placeholder="e.g., USD, INR"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Job Type</label>
                  <select
                    className="form-select"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="experience" className="form-label">Experience Level</label>
                  <select
                    className="form-select"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Experience Level</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-1">0-1 Year</option>
                    <option value="1-2">1-2 Years</option>
                    <option value="2-5">2-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Posting Job...
                    </>
                  ) : (
                    'Post Job'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob; 