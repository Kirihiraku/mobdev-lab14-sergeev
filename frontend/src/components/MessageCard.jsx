import { deleteMessage, likeMessage, reportMessage } from "../api/api"

const MessageCard = ({ content, createdAt, username, userId, id }) => {
    return (
        <div className="message-card">
            <div className="message-content">{content}</div>
            <div className="message-meta">
                <span className="message-author">{username}</span>
                <span className="message-time">{createdAt}</span>
            </div>
            <div className="message-actions">
                <button
                    onClick={() => likeMessage(id)}
                    className="action-button"
                >
                    <span>❤️🤍</span>
                    <span>0</span>
                </button>
            </div>
            <div className="message-actions">
                <button
                    onClick={() => reportMessage(id)}
                    className="action-button"
                >
                    <span>🚩</span>
                    <span>Пожаловаться</span>
                </button>
            </div>
            <div className="message-actions">
                <button
                    onClick={() => deleteMessage(id)}
                    className="action-button delete"
                >
                    <span>🗑️</span>
                    <span>Удалить</span>
                </button>
            </div>
        </div>
    )
}

export default MessageCard
