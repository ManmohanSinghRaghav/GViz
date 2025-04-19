import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ChatAI = () => {
  // State management
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Auth context
  const { isAuthenticated } = useAuth();
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input field on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle form submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Don't send empty messages or when loading
    if (!inputMessage.trim() || isLoading) return;
    
    // Check authentication
    if (!isAuthenticated) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Please log in to use the chat functionality.'
      }]);
      return;
    }

    // Add user message to chat
    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Call API
      console.log('Sending message to Gemini:', userMessage);
      const response = await chatService.sendMessage(userMessage);
      
      // Process response
      console.log('Received response from Gemini:', response);
      
      if (response && response.success) {
        // Add AI response to chat
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.response 
        }]);
      } else {
        // Handle error in response
        console.error('Error in Gemini response:', response);
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: `Error: ${response?.response || 'Failed to get response from Gemini'}`
        }]);
        setError('The AI service responded with an error.');
      }
    } catch (error) {
      // Handle network/API errors
      console.error('Failed to communicate with Gemini:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: `Sorry, there was an error communicating with the AI service. ${error.message || ''}`
      }]);
      setError('Failed to communicate with the chat service.');
    } finally {
      setIsLoading(false);
      // Focus input again after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Render chat UI
  return (
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl mx-auto h-[600px]">
      {/* Header */}
      <div className="p-4 bg-gray-700 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
          <h2 className="text-xl font-bold text-white">Gemini AI Chat</h2>
        </div>
        {error && (
          <div className="text-sm text-red-400 px-2 py-1 bg-red-900 bg-opacity-50 rounded">
            {error}
          </div>
        )}
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-900 bg-opacity-50">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : msg.role === 'system'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-white rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white p-3 rounded-lg rounded-bl-none max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Gemini something..."
            className="flex-1 p-3 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !isAuthenticated}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            disabled={isLoading || !inputMessage.trim() || !isAuthenticated}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex flex-col space-y-2">
          <div className="flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Gemini something..."
              className="flex-1 p-2 bg-gray-700 text-white rounded-l-lg focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-gray-600 text-white px-3 py-2 hover:bg-gray-500 focus:outline-none"
              disabled={isLoading}
              title="Upload an image"
            ></button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50"
              disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
            >
              {isLoading ? (
                <span className="flex items-center justify-center"></span>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Thinking
                </span>
              ) : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatAI;
