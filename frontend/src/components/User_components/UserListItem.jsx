import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({ user, handleClickFunction }) => {
  return (
    <Box
      onClick={handleClickFunction}
      cursor="pointer"
      _hover={{
        background: '#74C365',
        color: 'black',
      }}
      w="100%"
      d="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>

    </Box>
  )
}

export default UserListItem