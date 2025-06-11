import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forms.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
    } else {
      setResume(null);
      toast.error('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error('Please select a resume to upload');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobId', jobId);

    try {
      const response = await API.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.success) {
        toast.success('Application submitted successfully!');
        setResume(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Redirect after a delay
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      } else {
        toast.error(response.data?.message || 'Failed to submit application due to an unexpected response.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card form-container-card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4 form-title">Apply for Job</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="resume" className="form-label">Upload Resume (PDF)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="form-control"
                    id="resume"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="form-text">
                    Only PDF files are accepted (max 5MB)
                  </div>
                </div>

                {resume && (
                  <div className="mb-3">
                    <label className="form-label">Resume Preview</label>
                    <div className="border rounded p-2">
                      <iframe
                        src={URL.createObjectURL(resume)}
                        className="w-100"
                        style={{ height: '500px' }}
                        title="Resume Preview"
                      />
                    </div>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading || !resume}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => navigate('/jobs')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob; 