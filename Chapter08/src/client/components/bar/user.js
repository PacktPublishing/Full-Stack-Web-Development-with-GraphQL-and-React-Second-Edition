import React, { useState } from 'react';
import AvatarModal from '../avatarModal';

const UserBar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const showModal = () => {
    setIsOpen(!isOpen);
  }

  if(!user) return null;

  return (
    <div className="user">
      <img src={user.avatar} onClick={() => showModal()} />
      <AvatarModal isOpen={isOpen} showModal={showModal}/>
      <span>{user.username}</span>
    </div>
  );
}

export default UserBar
