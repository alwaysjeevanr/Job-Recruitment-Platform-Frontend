import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setIsLoggedIn(true);
      } catch {
        // Invalid token
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <img src="/yukti-works-logo.png" alt="YuktiWorks Logo" style={{ height: '40px', marginRight: '10px', marginTop: '-10px' }} />
          YuktiWorks
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/jobs">
                    <i className="bi bi-search me-1"></i>
                    Jobs
                  </Link>
                </li>
                {userRole === 'employer' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/post-job">
                      <i className="bi bi-plus-circle me-1"></i>
                      Post a Job
                    </Link>
                  </li>
                )}
                {userRole === 'employer' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/employer/jobs">
                      <i className="bi bi-briefcase me-1"></i>
                      My Job Posts
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                {userRole === 'employer' ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/applicants">
                      <i className="bi bi-file-earmark-text me-1"></i>
                      Applicants
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/applications">
                      <i className="bi bi-file-earmark-text me-1"></i>
                      My Applications
                    </Link>
                  </li>
                )}
                
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light ms-2" 
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-primary ms-2" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary ms-2" to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 