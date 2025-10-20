import { deleteMessage, likeMessage, reportMessage } from "../api/api"
import { useUserStore } from "../store/store"
import { useMessageStore } from "../store/useMessageStore"

const MessageCard = ({ content, createdAt, username, userId, id, likes, likedBy }) => {
    const loggedUserId = useUserStore((state) => state.jwt.userId)
    const { getMessages } = useMessageStore()

    

    const handleDelete = async () => {
        try {
         await deleteMessage(id)
         await getMessages()
        } catch (error) {
            console.error(error)
    }
}

const handleReport = async () => {
    try {
        await reportMessage(id)
        await getMessages()
    } catch (error) {
        console.error(error)
    }
}

const handleLike = async () => {
    try {
    await likeMessage(id)
    await getMessages()
    } catch (error) {
        console.error(error)
    }
}


    return (
        <div className="message-card">
            <div className="message-content">{content}</div>
            <div className="message-meta">
                <span className="message-author">{username}</span>
                <span className="message-time">{createdAt}</span>
            </div>
            <div className="message-actions">
                <button
                    onClick={handleLike}
                    className="action-button"
                >
                    <span>{likedBy.includes(loggedUserId) ? "❤️" : "🤍"}</span>
                    <span>{likes}</span>
                </button>
            </div>
            <div className="message-actions">
                <button
                    onClick={handleReport}
                    className="action-button"
                >
                    <span>🚩</span>
                    <span>Пожаловаться</span>
                </button>
            </div>
            {loggedUserId == userId && (
            <div className="message-actions">
                <button
                    onClick={handleDelete}
                    className="action-button delete">
                    <span>🗑️</span>
                    <span>Удалить</span>
                </button>
            </div>
            )}
            </div>
    )
}

export default MessageCard
