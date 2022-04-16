import { useContext, useState } from 'react'
import { Avatar, AvatarBadge, AvatarGroup, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, extendTheme, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import ChatState, { ChatContext } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../User_components/UserListItem'


const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)


  const { user, setSelectedChat, chats, setChats } = useContext(ChatContext)

  const toast = useToast()

  const history = useHistory()
  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    history.push("/")
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.post("/api/chat", { userId }, config)

      if(!chats.find((c) => c._id === data._id))
        setChats([data, ...chats])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch(error) {
      toast({
        title: "Error Fetching the chats",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
      setLoadingChat(false)
    } 
  }

  const handleSearch = async () => {
    if(!search) {
      toast({
        title: "Please Enter something",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      })

      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config)

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
      <Box 
      d="flex"
      justifyContent="space-between"
      alignItems="center"
      bg={"#fd5e53"}
      w="100%"
      p="5px 10px 5px 10px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button bg={"#3D3C3A"} variant="unstyled" onClick={onOpen}>
            <i  className="fas fa-search"></i>
          </Button>  
        </Tooltip> 

        <Text fontSize="2xl" fontWeight="bold">
          Lets-Chat 
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1}/>
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton colorScheme="myOrange" as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList bg={"#3D3C3A"}>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        placement='left'
        onClose={onClose}
        isOpen={isOpen}
        >
          <DrawerContent bg={"#343434"} color="whiteAlpha.800">
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input 
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
                />
                <Button colorScheme="myOrange" onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ): (
              searchResult?.map(user => (
                <UserListItem key={user._id} user={user} handleClickFunction={() => accessChat(user._id)} />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </>
  )
}

export default SideDrawer