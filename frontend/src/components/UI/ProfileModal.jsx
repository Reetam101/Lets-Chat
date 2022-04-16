import { ViewIcon } from "@chakra-ui/icons"
import { extendTheme, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Image, Text } from "@chakra-ui/react"

const ProfileModal = ({ user, children }) => {
  
  const { isOpen, onOpen, onClose } = useDisclosure()

  // const theme = extendTheme({
  //   components: {
  //     Modal: {
  //       baseStyles: (props) => ({
          
  //       })
  //     }
  //   }
  // })

  return (
    <>
      {
        children ? (
        <span onClick={onOpen}>{children}</span>
        ) : (
          <IconButton
            d={{ base: 'flex' }}
            icon={<ViewIcon />}
            onClick={onOpen} 
          />
        )
      }
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#242124"} color="whiteAlpha.800">
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between">
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text>
              {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='myOrange' onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal