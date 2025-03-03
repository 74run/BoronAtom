import React, { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  onUpdate: (data: any) => void;
}

const Chat: React.FC<ChatProps> = ({ onUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you create your resume. What would you like to start with?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: 'user' as const, content: inputMessage }
    ];
    setMessages(newMessages);
    setInputMessage('');

    // Here you would typically make an API call to your backend
    // For now, we'll simulate a response
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I received your message. What else would you like to add to your resume?'
      }]);

      // Update resume data (example)
      onUpdate({
        // Parse the message and update relevant resume sections
        // This is where you'd implement the logic to update the resume
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-gray-100'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-4 py-2 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-blue-700 
                     transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
