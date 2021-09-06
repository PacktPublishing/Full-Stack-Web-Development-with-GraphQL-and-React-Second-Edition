import React, { useState, useRef, useEffect } from 'react';

export default ({ trigger, children }) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef);

  function useOutsideClick(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShow(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return(
    <div className="dropdown">
      <div>
        <div className="trigger" onClick={() => setShow(!show)}>
          {trigger}
        </div>
        <div ref={wrapperRef}>
          { show &&
            <div className="content">
              {children}
            </div>
          }
        </div>
      </div>
    </div>
  )
}