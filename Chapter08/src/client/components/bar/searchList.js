import React, { useState, useEffect } from 'react';

const SearchList = ({ data: { usersSearch: { users }}}) => {
  const [show, setShowList] = useState(false);

  const handleShow = (show) => {
    if(show) {
      document.addEventListener('click', handleShow.bind(null, !show), true);
    } else {
      document.removeEventListener('click', handleShow.bind(null, !show), true);
    }
    setShowList(show);
  }

  const showList = (users) => {
    if(users.length) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  }

  useEffect(() => {
    showList(users);
  }, [users]);

  useEffect(() => {
    return () => {
      document.removeEventListener('click', handleShow.bind(null, !show), true);
    }
  });

  return (
    show &&
      <div className="result">
        {users.map((user, i) =>
          <div key={user.id} className="user">
            <img src={user.avatar} />
            <span>{user.username}</span>
          </div>
        )}
      </div>
  )
}

export default SearchList
