import React, { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

const ChatAI = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { text: input, type: 'user' }]);
    setInput('');
    // Add AI response logic here
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-96 h-[500px]' : 'w-14 h-14'}`}>
      
      <div className="bg-white rounded-lg shadow-lg w-full h-full flex flex-col">
        {isExpanded ? (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Chat with AI</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 
                    ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full h-full flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaRobot size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatAI;
