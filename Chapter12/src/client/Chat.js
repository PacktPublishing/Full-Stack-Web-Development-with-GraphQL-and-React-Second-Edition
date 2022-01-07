import React, { useState } from 'react';
import Loading from './components/loading';
import Error from './components/loading';
import { useGetChatQuery } from './apollo/queries/getChat';
import { getAddMessageMutation } from './apollo/mutations/addMessage';

const Chat = (props) => {
  const { chatId, closeChat } = props;
  const { loading, error, data } = useGetChatQuery(chatId);
  const [text, setText] = useState('');
  const [addMessage] = getAddMessageMutation(data);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && text.length) {
      addMessage({ variables: { message: { text, chatId } } }).then(() => {
        setText('');
      });
    }
  }

  if (loading) return <Loading />;
  if (error) return <div className="chatWindow"><Error><p>{error.message}</p></Error></div>;

  const { chat } = data;

  return (
    <div className="chatWindow">
      <div className="header">
        <span>{chat.users[1].username}</span>
        <button onClick={() => closeChat(chatId)} className="close">X</button>
      </div>
      <div className="messages">
        {chat.messages.map((message, j) =>
          <div key={'message' + message.id} className={'message ' + (message.user.id > 1 ? 'left' : 'right')}>
            {message.text}
          </div>
        )}
      </div>
      <div className="input">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyPress={handleKeyPress}/>
      </div>
    </div>
  )
}

export default Chat