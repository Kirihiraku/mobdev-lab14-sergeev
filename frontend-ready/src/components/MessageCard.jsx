import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const MessageCard = ({ 
  message, 
  onLike, 
  onReport, 
  onDelete, 
  currentUserId,
  isLoading = false 
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageTime) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return messageTime.toLocaleDateString();
  };

  const handleLike = () => {
    if (!isLoading && onLike) {
      onLike(message.id);
    }
  };

  const handleReport = () => {
    if (!isLoading && onReport) {
      onReport(message.id);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const isOwnMessage = currentUserId && message.authorId === currentUserId;
  const isLiked = message.likedBy && message.likedBy.includes(currentUserId);

  return (
    <>
      <div className="message-card">
        <div className="message-content">
          {message.content}
        </div>
        
        <div className="message-meta">
          <span className="message-author">@{message.author}</span>
          <span className="message-time">{formatTime(message.createdAt)}</span>
        </div>
        
        <div className="message-actions">
          <button
            className={`action-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={isLoading}
            title={isLiked ? 'Unlike this message' : 'Like this message'}
          >
            <span>{isLiked ? '♥' : '♡'}</span>
            <span>{message.likes || 0}</span>
          </button>
          
          <button
            className="action-button"
            onClick={handleReport}
            disabled={isLoading}
            title="Report this message"
          >
            <span>🚩</span>
            <span>Report</span>
          </button>
          
          {isOwnMessage && (
            <button
              className="action-button delete"
              onClick={handleDeleteClick}
              disabled={isLoading}
              title="Delete this message"
            >
              <span>🗑</span>
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Message"
        footer={
          <>
            <Button variant="secondary" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this message? This action cannot be undone.</p>
        <div className="message-card" style={{ marginTop: '1rem' }}>
          <div className="message-content">
            {message.content}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MessageCard;