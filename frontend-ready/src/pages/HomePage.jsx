import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { messagesApi, statsApi } from '../services/api';
import Navbar from '../components/Navbar';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import MessageCard from '../components/MessageCard';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ totalMessages: 0, totalLikes: 0 });
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load messages and stats on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
      loadStats();
    }
  }, [isAuthenticated]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await messagesApi.getAllMessages();
      setMessages(response.messages || []);
      setError('');
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await statsApi.getStats();
      setStats(response);
    } catch (err) {
      console.error('Failed to load stats:', err);
      // Don't show error for stats as it's not critical
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      setError('Message cannot be empty');
      return;
    }

    if (newMessage.length > 500) {
      setError('Message is too long');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await messagesApi.createMessage(newMessage.trim());
      
      // Add new message to the beginning of the list
      setMessages(prev => [response.message, ...prev]);
      setNewMessage('');
      setSuccessMessage('Message posted successfully!');
      
      // Update stats
      loadStats();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Failed to create message:', err);
      setError(err.message || 'Failed to post message. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      
      // Update stats
      loadStats();
      
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
      
      // Update stats
      loadStats();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete message:', err);
      setError('Failed to delete message. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');
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
    <div className="home-page">
      <Navbar />
      
      {/* Header Section */}
      <div className="home-header">
        <div className="container">
          <div className="home-welcome">
            <h1 className="welcome-text">
              Welcome back, <span className="welcome-username">{user?.username}</span>!
            </h1>
          </div>
          
          <div className="home-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.totalMessages}</span>
              <div className="stat-label">Total Messages</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalLikes}</span>
              <div className="stat-label">Total Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Message Section */}
      <div className="create-message-section">
        <div className="container">
          <div className="create-message-card">
            <h2 className="create-message-title">Share your feedback</h2>
            
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
            
            <form onSubmit={handleSubmitMessage} className="create-message-form">
              <TextArea
                value={newMessage}
                onChange={handleMessageChange}
                placeholder="What's on your mind? Share your feedback, ideas, or thoughts..."
                maxLength={500}
                rows={4}
                id="newMessage"
              />
              
              <div className="form-actions">
                <div className="character-count">
                  <span className={newMessage.length > 400 ? 'warning' : ''}>
                    {newMessage.length}/500 characters
                  </span>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !newMessage.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Posting...
                    </>
                  ) : (
                    'Post Message'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="messages-section">
        <div className="container">
          <h2 className="section-title">Recent Messages</h2>
          
          {isLoading ? (
            <div className="loading-text">
              <div className="loading-spinner-large"></div>
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3 className="empty-state-title">No messages yet</h3>
              <p className="empty-state-text">
                Be the first to share your feedback! Your thoughts and ideas help make our community better.
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

export default HomePage;