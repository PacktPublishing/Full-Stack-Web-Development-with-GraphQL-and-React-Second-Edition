import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import Loading from './components/loading';
import Error from './components/loading';
import { useGetChatsQuery } from './apollo/queries/getChats';
import { MESSAGES_SUBSCRIPTION } from './apollo/queries/messageAdded';
import { NEW_MESSAGE } from './apollo/mutations/addMessage';
import { GET_CHAT } from './apollo/queries/getChat';
import { ToastContainer, toast } from 'react-toastify';
import { useMessageAddedSubscription } from './apollo/subscriptions/messageAdded';
import { withApollo } from '@apollo/client/react/hoc';
import { UserConsumer } from './components/context/user';
import ChatItem from './components/chat/item';

const Chats = ({ client, user }) => {
  const { loading, error, data, subscribeToMore } = useGetChatsQuery();
  const [openChats, setOpenChats] = useState([]);

  useMessageAddedSubscription({
    onSubscriptionData: data => {
      if(data && data.subscriptionData && data.subscriptionData.data && data.subscriptionData.data.messageAdded)
        toast(data.subscriptionData.data.messageAdded.text, { position: toast.POSITION.TOP_LEFT });
    }
  });

  const subscribeToNewMessages = () => {
    subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || (!prev.chats || !prev.chats.length)) return prev;

        var index = -1;
        for(var i = 0; i < prev.chats.length; i++) {
          if(prev.chats[i].id == subscriptionData.data.messageAdded.chat.id) {
            index = i;
            break;
          }
        }

        if (index === -1) return prev;

        const newValue = Object.assign({},prev.chats[i], {
          lastMessage: {
            text: subscriptionData.data.messageAdded.text,
            __typename: subscriptionData.data.messageAdded.__typename
          }
        });

        if(user.id !== subscriptionData.data.messageAdded.user.id) {
          try {
            const data = client.readQuery({ query: GET_CHAT, variables: { chatId: subscriptionData.data.messageAdded.chat.id } });
            client.cache.modify({
              id: client.cache.identify(data.chat),
              fields: {
                messages(existingMessages = []) {
                  const newMessageRef = client.cache.writeFragment({
                    data: subscriptionData.data.messageAdded,
                    fragment: NEW_MESSAGE
                  });
                  return [...existingMessages, newMessageRef];
                }
              }
            });
          } catch(e) {}
        }

        var newList = {chats:[...prev.chats]};
        newList.chats[i] = newValue;
        return newList;
      }
    });
  }

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

  useEffect(() => {
    subscribeToNewMessages()
  }, []);

  const closeChat = (id) => {
    var openChatsTemp = openChats.slice();

    const index = openChatsTemp.indexOf(id);
    openChatsTemp.splice(index,1),

    setOpenChats(openChatsTemp);
  }


  if (loading) return <Loading />;
  if (error) return <div className="chats"><Error><p>{error.message}</p></Error></div>;

  const { chats } = data;

  return (
    <div className="wrapper">
      <ToastContainer/>
      <div className="chats">
        {chats.map((chat, i) =>
          <ChatItem key={"chatItem" + chat.id} chat={chat} user={user} openChat={openChat} />
        )}
      </div>
      <div className="openChats">
        {openChats.map((chatId, i) => <Chat chatId={chatId} key={"chatWindow" + chatId} closeChat={closeChat} /> )}
      </div>
    </div>
  )
}

const ChatContainer = (props) => <UserConsumer><Chats {...props} /></UserConsumer>

export default withApollo(ChatContainer)
