import axios from 'axios'
import { Box } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { ChatContext, ChatState } from '../context/ChatProvider'
import SideDrawer from '../components/UI/SideDrawer'
import Chats from '../components/Chats'
import ChatBox from '../components/ChatBox'
import { useHistory } from 'react-router-dom'

const ChatPage = () => {
    // const { user } = ChatState()
    // console.log(user)
    // const history = useHistory()
    // const [user, setUser] = useState()
    // useEffect(() => {
    //     const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    //     setUser(userInfo) 
        
    //     if(!userInfo) {
    //         history.push("/")
    //     }
    // }, [history, setUser])
    const { user, setUser } = useContext(ChatContext)
    const [fetchAgain, setFetchAgain] = useState(false)
    console.log(user)
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer/>}
            <Box
                d="flex"
                justifyContent="space-between"
                w="100%"
                h="91.5vh"
                p="10px">
                {user && <Chats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage