import React from 'react';
import RecentJobList from '../components/RecentJobList';
import MultiFieldSearchBar from '../components/MultiFieldSearchBar';
import './Welcome.css'; // Import Welcome.css for specific styling

const Welcome = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-3">
        <div className="container text-center py-3">
          <h2 className="display-4 fw-bold mb-3">Welcome to YuktiWorks</h2>
          <p className="lead text-muted mb-5">Find your dream job or post job openings.</p>
          {/* Search Bar */}
          <div className="search-bar-wrapper">
            <MultiFieldSearchBar />
          </div>
        </div>
      </section>

      {/* Recent Job Listings Section */}
      <section className="recent-jobs-section mt-n5">
         <div className="container">
            <RecentJobList /> 
         </div>
      </section>
    </div>
  );
};

export default Welcome; 