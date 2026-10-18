import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import './AiChatbot.css';

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! 👋 I am your Amazon AI Shopping Assistant. Ask me anything about products or budget recommendations!' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentQuery = input;
    setInput('');

    axios.post(`${API_BASE_URL}/ai/chat`, { message: currentQuery })
      .then(res => {
        setMessages(prev => [...prev, { sender: 'bot', text: res.data.response }]);
      })
      .catch(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am facing server connectivity issues.' }]);
      });
  };

  return (
    <div className="ai-chatbot-wrapper">
      {!isOpen && (
        <button className="ai-chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <FaRobot className="chat-bot-icon" /> Ask AI
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="header-title">
              <FaRobot />
              <span>Amazon AI Assistant</span>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form className="ai-chat-input-row" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask about products, budget..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
            />
            <button type="submit"><FaPaperPlane /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;