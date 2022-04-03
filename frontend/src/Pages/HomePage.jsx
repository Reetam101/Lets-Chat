import {Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'

const HomePage = () => {
  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg={"#fd5e53"}
        // bg={"teal"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        boxShadow="xl"
      >
        <Text fontSize="2xl">Lets-Chat</Text>
      </Box>
      <Box 
       
      p={4}
      bg={"#2e262592"}
      w="100%" 
      borderRadius="lg"
      >
        <Tabs variant='solid-rounded' colorScheme="myOrange" >
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage