import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("")
  const [selectedChat, setSelectedChat] = useState()
  const [chats, setChats] = useState([])
  const [notification, setNotification] = useState([])


  const history = useHistory()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    setUser(userInfo) 
    // console.log(user)

    if(userInfo) {
      history.push("/chats")
    } else {
      history.push("/")
    }
  }, [history])

  return (
    <ChatContext.Provider value={{ user, 
    setUser, 
    selectedChat, 
    setSelectedChat, 
    chats, 
    setChats,
    notification,
    setNotification
    }}>
      {children}
    </ChatContext.Provider>
  )
}

// export const ChatState = () => {
//   return useContext(ChatContext)
// }

export default ChatProvider