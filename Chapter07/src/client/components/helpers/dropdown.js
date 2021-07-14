import React, { useState, useEffect } from 'react';

export default ({ trigger, children }) => {
  const [show, setShow] = useState(false);

  const handleClick = (show) => {
    if(!show) {
      document.addEventListener('click', handleClick.bind(null, [show]), true);
    } else {
      document.removeEventListener('click', handleClick.bind(null, [show]), true);
    }
    setShow(!show);
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('click', handleClick.bind(null, [show]), true);
    }
  }, []);

  return(
    <div className="dropdown">
      <div>
        <div className="trigger" onClick={() => handleClick(show)}>
          {trigger}
        </div>
        { show &&
          <div className="content">
            {children}
          </div>
        }
      </div>
    </div>
  )
}