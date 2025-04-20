import React, { useState, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { chatService } from '../../services/api';
import { THEME } from '../../config/api.config';

// Helper function to format text with markdown-style syntax
const formatMessage = (text) => {
  if (!text) return '';

  // Format bold text (**text**)
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Format italic text (*text*)
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Format lists
  formattedText = formattedText.replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>');
  formattedText = formattedText.replace(/<li>(.*?)<\/li>(?:\s*<li>)/g, '<ul><li>$1</li><li>');
  formattedText = formattedText.replace(/<li>(.*?)<\/li>(?!\s*<li>)/g, '<li>$1</li></ul>');
  
  // Format line breaks
  formattedText = formattedText.replace(/\n/g, '<br>');
  
  return formattedText;
};

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

  // Message component to render formatted text
  const MessageContent = ({ content }) => {
    return (
      <div dangerouslySetInnerHTML={{ __html: formatMessage(content) }} />
    );
  };

  // Generate AI response
  const generateAIResponse = async (userMessage) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending message to AI:', userMessage);
      const response = await chatService.sendMessage(userMessage);
      
      if (response && response.success) {
        return response.response;
      } else {
        setError('Failed to get response from AI');
        return 'I\'m sorry, but I encountered an error. Please try again.';
      }
    } catch (error) {
      console.error('AI API Error:', error);
      setError(error.message || 'Error communicating with AI');
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

    const aiResponse = await generateAIResponse(userMessage);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
  };

  // Handle quick message selection
  const handleQuickMessage = async (message) => {
    if (isLoading) return;
    
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setHasStartedChat(true);

    const aiResponse = await generateAIResponse(message);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-12 h-12 rounded-full 
          bg-gradient-to-r from-indigo-500 to-indigo-600 
          text-white flex items-center justify-center shadow-lg 
          hover:shadow-indigo-500/50 transition-all duration-300
          hover:scale-110"
      >
        <FaRobot className="text-xl" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 rounded-lg overflow-hidden">
          {/* Gradient Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg blur opacity-30"></div>
          
          <div className="relative bg-white backdrop-blur-xl shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-indigo-200 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-white text-lg" />
                <span className="font-medium">
                  AI Assistant
                </span>
              </div>
              <button 
                onClick={toggleChat}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages Container */}
            <div id="message-container" className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && !hasStartedChat && (
                <div className="text-center text-gray-500 italic py-8">
                  Start a conversation with your AI assistant or choose a quick message below.
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-indigo-100 text-gray-800'
                      : 'bg-white border border-gray-200 shadow-sm text-gray-800'
                  }`}>
                    {msg.sender === 'ai' ? (
                      <MessageContent content={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="text-center my-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Quick Message Buttons - Only show if chat hasn't started */}
            {!hasStartedChat && (
              <div className="p-2 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  {quickMessages.map((msg, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickMessage(msg)}
                      disabled={isLoading}
                      className="p-2 text-sm rounded-lg text-indigo-700
                        bg-indigo-50 hover:bg-indigo-100
                        border border-indigo-200
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
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-50 text-gray-800 placeholder-gray-400 
                    rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                    border border-gray-300"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 
                    text-white hover:shadow-lg hover:shadow-indigo-200
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
