import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MultiFieldSearchBar.css';

const MultiFieldSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');

  const navigate = useNavigate();
  const urlLocation = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(urlLocation.search);
    setSearchTerm(params.get('search') || '');
    setLocation(params.get('location') || '');
    setExperience(params.get('experience') || '');
  }, [urlLocation.search]);

  const handleSearch = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append('search', searchTerm);
    if (location) queryParams.append('location', location);
    if (experience) queryParams.append('experience', experience);

    navigate(`/jobs?${queryParams.toString()}`);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="multi-field-search-form">
        <div className="search-wrapper">
          <div className="search-field">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by Skills, Company or Job Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="bi bi-search search-icon"></i>
          </div>

          <div className="search-field">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <i className="bi bi-geo-alt search-icon"></i>
          </div>

          <div className="search-field">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Experience Level (e.g., Fresher, 0, 5-10)"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
            <i className="bi bi-briefcase search-icon"></i>
          </div>

          <button type="submit" className="btn btn-primary search-btn custom-visible-btn">
            <i className="bi bi-search me-2"></i>
            Search Jobs
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiFieldSearchBar; 