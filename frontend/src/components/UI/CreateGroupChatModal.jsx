import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatProvider'
import UserBadgeItem from '../User_components/UserBadgeItem'
import UserListItem from '../User_components/UserListItem'

const CreateGroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const { user, chats, setChats } = useContext(ChatContext)

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

  const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top"
      })

      return
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.post("/api/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map(u => u._id))
      }, config)

      setChats([data, ...chats])
      onClose()
      toast({
      title: "New Group Chat successfully created",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top"
    })

    } catch(error) {
      toast({
        title: "Failed to create the chat",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    }

  }
  
  const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
      return
    }

    setSelectedUsers([...selectedUsers, userToAdd])
  }

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id))
  }
  
  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={"#343434"} color="whiteAlpha.800">
        <ModalHeader>Create Group Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody d="flex" flexDir="column" alignItems="center">
          <FormControl>
            <Input placeholder='chat name' mb={3} onChange={e => setGroupChatName(e.target.value)} />
          </FormControl>
          <FormControl>
            <Input placeholder='Add users' mb={1} onChange={e => handleSearch(e.target.value)} />
          </FormControl>
          <Box w="100%" d="flex" flexWrap="wrap">
            {selectedUsers.map(u => (
              <UserBadgeItem key={user._id} user={u} handleFunction={() => handleDelete(u)} />
            ))}
          </Box>

          {loading ? (<div>Loading...</div>) : (
            searchResult?.slice(0,4).map(user => 
              <UserListItem key={user._id} user={user} handleClickFunction={() => handleGroup(user)} />)
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='myOrange' onClick={handleSubmit}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default CreateGroupChatModal