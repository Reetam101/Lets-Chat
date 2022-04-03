import axios from 'axios'
import { useEffect, useState } from 'react'

const ChatPage = () => {
    const [chats, setChats] = useState([])

    const fetchChats = async() => {
        const { data } = await axios.get('/api/chat')
        // console.log(data)
        setChats(data)
    }    

    useEffect(() => {
        fetchChats()
    }, [])
    return (
        <div>
            {chats.map(chat => <div key={chat._id}>{ chat.chatName }</div>)}
        </div>
    )
}

export default ChatPage