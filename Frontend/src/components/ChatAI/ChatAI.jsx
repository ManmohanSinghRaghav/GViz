import React, { useState, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { chatService } from '../../services/api';

const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const quickMessages = [
    "Hi! How are you?",
    "What can you help me with?",
    "Tell me about career paths",
    "Show me learning resources"
  ];

  // Toggle the chat window
  const toggleChat = () => setIsOpen(!isOpen);

  // Automatically scroll to bottom when new messages are added
  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  // Generate Gemini response
  const generateGeminiResponse = async (userMessage) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending message to Gemini:', userMessage);
      const response = await chatService.sendMessage(userMessage);
      
      if (response && response.success) {
        return response.response;
      } else {
        setError('Failed to get response from Gemini');
        return 'I\'m sorry, but I encountered an error. Please try again.';
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      setError(error.message || 'Error communicating with Gemini');
      return `I apologize, but I encountered an error: ${error.message || 'Unknown error'}`;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setHasStartedChat(true);

    const aiResponse = await generateGeminiResponse(userMessage);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
  };

  // Handle quick message selection
  const handleQuickMessage = async (message) => {
    if (isLoading) return;
    
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setHasStartedChat(true);

    const aiResponse = await generateGeminiResponse(message);
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
                <span className="text-slate-200 font-medium">
                  Gemini 1.5 Flash
                </span>
              </div>
              <button 
                onClick={toggleChat}
                className="text-slate-200 hover:text-violet-400 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages Container */}
            <div id="message-container" className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-violet-500/20">
              {messages.length === 0 && !hasStartedChat && (
                <div className="text-center text-slate-400 italic py-8">
                  Start a conversation with Gemini or choose a quick message below.
                </div>
              )}
              
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
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-slate-800/50 text-slate-200">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="text-center my-2 p-2 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Quick Message Buttons - Only show if chat hasn't started */}
            {!hasStartedChat && (
              <div className="p-2 border-t border-violet-500/20 bg-slate-900/50">
                <div className="grid grid-cols-2 gap-2">
                  {quickMessages.map((msg, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickMessage(msg)}
                      disabled={isLoading}
                      className="p-2 text-sm rounded-lg text-slate-200
                        bg-gradient-to-r from-violet-600/20 to-purple-600/20
                        hover:from-violet-600/30 hover:to-purple-600/30
                        border border-violet-500/20
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed"
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
                  placeholder="Ask Gemini 1.5 something..."
                  className="flex-1 bg-slate-800/50 text-slate-200 placeholder-violet-400/50 
                    rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/40
                    border border-violet-500/20"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 
                    text-slate-200 hover:shadow-lg hover:shadow-violet-500/25 
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed"
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
