import { useEffect, useState } from "react"
import MessageCard from "./MessageCard"
import { fetchMessages } from "../api/api"
import MessageField from "./MessageField"
import { useUserStore } from "../store/store"

const Feed = () => {
    const [messages, setMessages] = useState(undefined)
    const {jwt} = useUserStore()

    useEffect(() => {
        const handleFetch = async () => {
            try {
                setMessages(await fetchMessages())
            } catch (err) {
                console.error(err)
            }
        }
        handleFetch()
    }, [])

    return (
        <>
            {jwt && <MessageField />}
            <div className="messages-section">
                <div className="container">
                    <h2 className="section-title">Последние сообщения</h2>
                    <div className="messages-grid">
                        {messages &&
                            messages.map((message) => (
                                <MessageCard key={message.id} {...message} />
                            ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Feed

// 1. Нужно где-то хранить, стейт
// 2. Дописать метод для получения сообщения в api.jsx
// 3. На прогрузке Feed (через useEffect) необходимо делать запрос и забирать все сообщения
// 4. Необходимо отображать все сообщения
