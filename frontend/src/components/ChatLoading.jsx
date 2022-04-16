import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="30px" mb={2}/>
      <Skeleton height="30px" mb={2}/>
      <Skeleton height="30px" mb={2}/>
      <Skeleton height="30px" mb={2}/>
      <Skeleton height="30px" mb={2}/>
      <Skeleton height="30px" mb={2}/>
      <Skeleton height="30px" mb={2}/>
    </Stack>
  )
}

export default ChatLoading