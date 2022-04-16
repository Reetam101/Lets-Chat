import { useEffect, useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'


const Login = () => {
  const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')
	const [show, setShow] = useState(false)
	const [loading, setLoading] = useState(false)
	const history = useHistory()
	const toast = useToast()

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"))
		if(userInfo) {
			history.push("/chats")
		}
	}, [history])

  const submitHanlder = async (e) => {
		setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);
			history.push("/chats");
			window.location.reload(false)

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

    } catch (error) {
			console.log(error)
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
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