import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { getSender, getSenderObject } from '../helpers/ChatHelpers'
import ProfileModal from './UI/ProfileModal'
import GroupChatInfoModal from './UI/GroupChatInfoModal'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext)

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
               <GroupChatInfoModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
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
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            {/* TODO: Messages to be displayed */}
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