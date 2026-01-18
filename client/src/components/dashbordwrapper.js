import React from 'react';
import '../styles/container.css';

const DashboardSectionWrapper = ({ children }) => {
  return (
    <div className="contain">
      <div className="overview">{children}</div>
    </div>
  );
};

export default DashboardSectionWrapper;
