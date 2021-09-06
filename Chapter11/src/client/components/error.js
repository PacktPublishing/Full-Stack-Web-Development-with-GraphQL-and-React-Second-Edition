import React from 'react';

export default ({ children }) => {
  return (
    <div className="error message">
      {children}
    </div>
  );
}
