import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { getSender, getSenderObject } from '../helpers/ChatHelpers'
import ProfileModal from './UI/ProfileModal'
import GroupChatInfoModal from './UI/GroupChatInfoModal'
import axios from 'axios'
import './Styles.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:5000"
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext)

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")

  const [socketConnected, setSocketConnected] = useState(false)
  
  const toast = useToast()
  
  const typingHandler = (e) => {
    setNewMessage(e.target.value)
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user)
    socket.on('connection', () => {
      setSocketConnected(true)
    })
  }, [])

  const fetchMessages = async () => {
    if(!selectedChat) return

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      setLoading(true)
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)

      setMessages(data)
      setLoading(false)

      socket.emit('join chat', selectedChat._id)
    } catch(error) {
      toast({
        title: "Error occured",
        description: `Failed to load messages ${error.response.data.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
    }
  }
  
  const sendMessage = async (e) => {
    if(e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }

        setNewMessage("")
        const {data} = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id
        }, config)
        
        console.log(data)

        socket.emit('new message', data)
        setMessages([...messages, data])
      } catch(error) {
        toast({
          title: "Error occured",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
      }
    }
  }

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        // give notification
      } else {
        setMessages([...messages, newMessageRecieved])
      }
    })
  })
  
  useEffect(() => {
    fetchMessages()

    selectedChatCompare = selectedChat
  }, [selectedChat])

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              bg={"#3D3C3A"}
              variant="unstyled"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")} 
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderObject(user, selectedChat.users)}/>
              </>
            ) : (
              <>
               {selectedChat.chatName.toUpperCase()} 
               <GroupChatInfoModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg={"#343434"}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner 
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input 
                bg="#3b3c36"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3}>Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat