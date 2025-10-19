import { useEffect, useState } from "react"
import MessageCard from "./MessageCard"
import { fetchMessages } from "../api/api"
import MessageField from "./MessageField"
import { useUserStore } from "../store/store"
import { useMessageStore } from "../store/useMessageStore"

const Feed = ({myOwn = false}) => {
    const { messages, getMessages} = useMessageStore()
    const {jwt} = useUserStore()

    useEffect(() => {
        const handleFetch = async () => {
            try {
                getMessages()
            } catch (err) {
                console.error(err)
            }
        }
        handleFetch()
    }, [])

    return (
        <>
            <div className="messages-section">
                <div className="container">
                    <h2 className="section-title">Последние сообщения</h2>
                    <div className="messages-grid">
                        {!myOwn 
                        ? messages && 
                        messages.map((message) => (
                                <MessageCard key={message.id} {...message} />
                            ))
                            : messages
                            .filter(
                                (message) => message.userId == jwt.userId)
                                .map((message) => (
                                    <MessageCard key={message.id} {...message}
                                    />
                                ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Feed
