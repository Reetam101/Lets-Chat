import { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'


const Login = () => {
  const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')
	const [show, setShow] = useState(false)

  const submitHanlder = (e) => {

	}

  return (
    <VStack spacing="5px">
					<FormControl  id='login-email' isRequired>
              <FormLabel>
								Email
              </FormLabel>
              <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              placeholder='Enter your email'
							/>
          </FormControl>
					<FormControl id='login-password' isRequired>
              <FormLabel>
								Password
              </FormLabel>
							<InputGroup>
								<Input
								type={"password"}
                value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Enter your password'
								/>
								<InputRightElement width="4.5rem">
									<Button h="1.75rem" size="sm" colorScheme="">
										{show ? "Hide" : "Show"}
									</Button>
								</InputRightElement>

							</InputGroup>
          </FormControl>

					<Button
					colorScheme="myOrange"
					width="100%"
					style={{marginTop: 15}}
					onClick={submitHanlder}
					>
						Login
					</Button>
					<Button
					colorScheme="myGreen"
					width="100%"
					style={{marginTop: 15}}
					onClick={() => {
            setEmail("guest@gmail.com")
            setPassword("123456")
          }}
					>
						Get Guest User Credentials
					</Button>
      </VStack>
  )
}

export default Login