import React from 'react';

const usernamesToString = (user, userList)  => {
  var usernamesString = '';

  for(var i = 0; i < userList.length; i++) {
    if(userList[i].username !== user.username) {
      usernamesString += userList[i].username;
    }
    if(i - 1 === userList.length) {
      usernamesString += ', ';
    }
  }
  return usernamesString;
}

const shorten = (text) => {
  if(!text.length) {
    return "";
  }
  if (text.length > 12) {
    return text.substring(0, text.length - 9) + '...';
  }
  return text;
}

const getAvatar = (user, userList) => {
  if(userList.length > 2 ) {
    return '/public/group.png';
  } else {
    if(userList[0].id !== user.id) {
      return userList[0].avatar;
    } else {
      return userList[1].avatar;
    }
  }
}

const ChatItem = ({ user, chat, openChat }) => {
  return (
    <div key={chat.id} className="chat" onClick={() => openChat(chat.id)}>
      <div className="header">
        <img src={getAvatar(user, chat.users)} />
        <div>
          <h2>{shorten(usernamesToString(user, chat.users))}</h2>
          <span>{chat?.lastMessage?.text}</span>
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
