import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Chat from './Chat';

const GET_CHATS = gql`{
  chats {
    id
    users {
      id
      avatar
      username
    }
    lastMessage {
      text
    }
  }
}`;


const usernamesToString = (users)  => {
  const userList = users.slice(1);
  var usernamesString = '';

  for(var i = 0; i < userList.length; i++) {
    usernamesString += userList[i].username;
    if(i - 1 === userList.length) {
      usernamesString += ', ';
    }
  }
  return usernamesString;
}

const shorten = (text) => {
  if (text.length > 12) {
    return text.substring(0, text.length - 9) + '...';
  }

  return text;
}

const Chats = () => {
  const { loading, error, data } = useQuery(GET_CHATS);
  const [openChats, setOpenChats] = useState([]);

  const openChat = (id) => {
    var openChatsTemp = openChats.slice();

    if(openChatsTemp.indexOf(id) === -1) {
      if(openChatsTemp.length > 2) {
        openChatsTemp = openChatsTemp.slice(1);
      }
      openChatsTemp.push(id);
    }

    setOpenChats(openChatsTemp);
  }

  const closeChat = (id) => {
    var openChatsTemp = openChats.slice();

    const index = openChatsTemp.indexOf(id);
    openChatsTemp.splice(index,1),

    setOpenChats(openChatsTemp);
  }


  if (loading) return <div className="chats"><p>Loading...</p></div>;
  if (error) return <div className="chats"><p>{error.message}</p></div>;

  const { chats } = data;

  return (
    <div className="wrapper">
        <div className="chats">
          {chats.map((chat, i) =>
            <div key={"chat" + chat.id} className="chat" onClick={() => openChat(chat.id)}>
              <div className="header">
                <img src={(chat.users.length > 2 ? '/public/group.png' : chat.users[1].avatar)} />
                <div>
                  <h2>{shorten(usernamesToString(chat.users))}</h2>
                  <span>{chat?.lastMessage?.text}</span>
                </div>
              </div>
          </div>
        )}
      </div>
      <div className="openChats">
        {openChats.map((chatId, i) => <Chat chatId={chatId} key={"chatWindow" + chatId} closeChat={closeChat} /> )}
      </div>
    </div>
  )
}

export default Chats
