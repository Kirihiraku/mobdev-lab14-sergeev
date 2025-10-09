import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { messagesApi } from '../services/api';
import Navbar from '../components/Navbar';
import MessageCard from '../components/MessageCard';

const MyMessagesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load user's messages on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadMyMessages();
    }
  }, [isAuthenticated, user]);

  const loadMyMessages = async () => {
    try {
      setIsLoading(true);
      const response = await messagesApi.getAllMessages();
      
      // Filter to show only current user's messages
      const myMessages = (response.messages || []).filter(
        message => message.authorId === user?.id
      );
      
      setMessages(myMessages);
      setError('');
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load your messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeMessage = async (messageId) => {
    try {
      await messagesApi.likeMessage(messageId);
      
      // Update the message in the local state
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const isLiked = msg.likedBy && msg.likedBy.includes(user.id);
          return {
            ...msg,
            likes: isLiked ? (msg.likes || 0) - 1 : (msg.likes || 0) + 1,
            likedBy: isLiked 
              ? (msg.likedBy || []).filter(id => id !== user.id)
              : [...(msg.likedBy || []), user.id]
          };
        }
        return msg;
      }));
      
    } catch (err) {
      console.error('Failed to like message:', err);
      setError('Failed to like message. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReportMessage = async (messageId) => {
    try {
      await messagesApi.reportMessage(messageId);
      setSuccessMessage('Message reported successfully. Thank you for helping keep our community safe!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Failed to report message:', err);
      setError('Failed to report message. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messagesApi.deleteMessage(messageId);
      
      // Remove message from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSuccessMessage('Message deleted successfully.');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete message:', err);
      setError('Failed to delete message. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="loading-page">
        <div className="loading-spinner-large"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="my-messages-page">
      <Navbar />
      
      {/* Header Section */}
      <div className="my-messages-header">
        <div className="container">
          <h1 className="my-messages-title">My Messages</h1>
          <p className="my-messages-count">
            You have <span className="count-number">{messages.length}</span> {messages.length === 1 ? 'message' : 'messages'}
          </p>
        </div>
      </div>

      {/* Messages Section */}
      <div className="messages-section">
        <div className="container">
          {error && (
            <div className="auth-error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="toast toast-success" style={{ position: 'relative', marginBottom: '1rem' }}>
              <p className="toast-message">{successMessage}</p>
            </div>
          )}
          
          {isLoading ? (
            <div className="loading-text">
              <div className="loading-spinner-large"></div>
              Loading your messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3 className="empty-state-title">No messages yet</h3>
              <p className="empty-state-text">
                You haven't posted any messages yet. Head over to the home page to share your first feedback!
              </p>
            </div>
          ) : (
            <div className="messages-grid">
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onLike={handleLikeMessage}
                  onReport={handleReportMessage}
                  onDelete={handleDeleteMessage}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMessagesPage;