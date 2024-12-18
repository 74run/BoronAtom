// ChatBox.js

import React, { useState } from 'react';
import '../css/ChatBox.css'; // Import CSS file for styling

import { useParams } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  sender: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const { userID } = useParams();

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() !== '') {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText.trim(),
        sender: 'user',
      };
  
      // Update messages with the new user message
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
  
      // Send user message to backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/chat/${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newMessage.text }),
      });
  
      const data = await response.json();
      const aiMessage: Message = {
        id: messages.length + 2,
        text: data.message,
        sender: 'ai',
      };
  
      // Update messages with the AI response
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Gemini Resume</h1>
      <div className="chat-box">
        <div className="message-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <p style={{ fontSize: '12px' }}>{message.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleMessageSubmit}>
          <textarea
            placeholder="Type your message..."
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleMessageSubmit(e);
              }
            }}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
