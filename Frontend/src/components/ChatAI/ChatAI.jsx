import React, { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { OPENAI_API_KEY, OPENAI_API_URL } from '../../config/api.config';

const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const quickMessages = [
    "Hi! How are you?",
    "What can you help me with?",
    "Tell me about career paths",
    "Show me learning resources"
  ];

  const toggleChat = () => setIsOpen(!isOpen);

  const generateAIResponse = async (userMessage) => {
    try {
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for SynqTech learning platform."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY.trim()}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      return data.choices[0].message.content;
    } catch (error) {
      console.error('API Error:', error);
      return 'I apologize, but I encountered an error. Please check your API configuration.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setHasStartedChat(true);

    try {
      const aiResponse = await generateAIResponse(userMessage);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'ai' 
      }]);
    }
  };

  const handleQuickMessage = async (message) => {
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setHasStartedChat(true);

    // Generate and add AI response
    const aiResponse = await generateAIResponse(message);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-12 h-12 rounded-full 
          bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 
          text-slate-200 flex items-center justify-center shadow-lg 
          hover:shadow-violet-500/50 transition-all duration-300
          hover:scale-110 animate-gradient-x"
      >
        <FaRobot className="text-xl" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 rounded-lg overflow-hidden">
          {/* Glass Background with Gradient Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg blur opacity-30"></div>
          
          <div className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-xl">
            {/* Header */}
            <div className="p-4 border-b border-violet-500/20 flex justify-between items-center bg-gradient-to-r from-violet-600/10 to-purple-600/10">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-violet-400 text-lg" />
                <span className="text-slate-200 font-medium">AI Assistant</span>
              </div>
              <button 
                onClick={toggleChat}
                className="text-slate-200 hover:text-violet-400 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages Container */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-violet-500/20">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-slate-200'
                      : 'bg-slate-800/50 text-slate-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Message Buttons - Only show if chat hasn't started */}
            {!hasStartedChat && (
              <div className="p-2 border-t border-violet-500/20 bg-slate-900/50">
                <div className="grid grid-cols-2 gap-2">
                  {quickMessages.map((msg, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickMessage(msg)}
                      className="p-2 text-sm rounded-lg text-slate-200
                        bg-gradient-to-r from-violet-600/20 to-purple-600/20
                        hover:from-violet-600/30 hover:to-purple-600/30
                        border border-violet-500/20
                        transition-all duration-300"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-violet-500/20">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-800/50 text-slate-200 placeholder-violet-400/50 
                    rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/40
                    border border-violet-500/20"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 
                    text-slate-200 hover:shadow-lg hover:shadow-violet-500/25 
                    transition-all duration-300"
                >
                  <FaPaperPlane className="text-lg" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAI;
