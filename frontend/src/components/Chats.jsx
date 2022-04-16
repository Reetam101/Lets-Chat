import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { getSender } from '../helpers/ChatHelpers'
import ChatLoading from './ChatLoading'
import GroupChatModal from './UI/GroupChatModal'

const Chats = () => {
  const [loggedUser, setLoggedUser] = useState()
  const { user, selectedChat, setSelectedChat, chats, setChats } = useContext(ChatContext)
  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
  
      const { data } = await axios.get("/api/chat", config)
      setChats(data)
      console.log(chats)
    } catch(error) {
      toast({
        title: "Failed to load chats",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [])
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={"#242124"}
      w={{ base: "100%", md:"31%" }}
      borderRadius="lg"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            colorScheme="myOrange"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>

        </GroupChatModal>

      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"   
      >
        {chats ? (
          <Stack overflowY="scroll">
            { chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#9acd32" : "#3b3c36"}
                color={selectedChat === chat ? "black" : "white"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            )) }
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>

    </Box>
  )
}

export default Chats