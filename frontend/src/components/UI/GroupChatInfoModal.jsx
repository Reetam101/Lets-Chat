import React, { useContext, useState } from 'react'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatContext } from '../../context/ChatProvider'
import UserBadgeItem from '../User_components/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../User_components/UserListItem'


const GroupChatInfoModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  const toast = useToast()

  const { selectedChat, setSelectedChat, user } = useContext(ChatContext)
  
  const handleRemove = async (removed_user) => {
    if(selectedChat.groupAdmin._id !== user._id && removed_user._id !== user._id) {
      toast({
        title: "You are not an admin, only admins can remove users from group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.put('/api/chat/groupremove', {
        chatId: selectedChat._id,
        userId: removed_user._id
      }, config)

      removed_user._id === user._id ? setSelectedChat() : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
    } catch(error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
    }
  }

  const handleAddUser = async (added_user) => {
    if(selectedChat.users.find((u) => u._id === added_user._id)) {
      toast({
        title: "User already in the group",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      return
    }

    if(selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "You are not an admin, only admins can add users to group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.put("/api/chat/groupadd", {
        chatId: selectedChat._id,
        userId: added_user._id
      }, config)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      toast({
        title: "User added to group, successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)

    } catch(error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      setLoading(false)
    }
  }

  const handleRename = async () => {
    if(!groupChatName) {
      return
    }

    try {
      setRenameLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.put('/api/chat/rename', {
        chatId: selectedChat._id,
        chatName: groupChatName
      }, config)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch(error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
      setRenameLoading(false)
    }

    setGroupChatName("")
  }

  const handleSearch = async (query) => {
    setSearch(query)
    if(!query) {
      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config)
      console.log(data)
      setLoading(false)
      setSearchResult(data)
    } catch(error) {
      toast({
        title: "Error Occured",
        description: `Failed to load search results ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
      setLoading(false)
    }
  }

  return (
    <>
      <IconButton d={{ base: "flex" }} bg={"#3D3C3A"}
        variant="unstyled" icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
        <ModalContent bg={"#242124"} color="whiteAlpha.800">
          <ModalHeader fontSize="35px" d="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedChat.users.map(u => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
              ))}
            </Box>
            <FormControl d="flex">
              <Input 
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <Button
                variant="solid"
                colorScheme="darkYellow"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
            <Input placeholder='Add user to group' mb={1} onChange={e => handleSearch(e.target.value)} />
          </FormControl>
          </ModalBody>

          {loading ? (
            <Spinner size="lg" />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleClickFunction={() => handleAddUser(user)}              
              />
            ))
          )}

          <ModalFooter>
            <Button colorScheme='red' onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatInfoModal