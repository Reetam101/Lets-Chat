import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const Signup = () => {
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const [email, setEmail] = useState('')
	const [image, setImage] = useState('https://cdn-icons-png.flaticon.com/512/456/456212.png')
	const [show, setShow] = useState(false)
	const [loading, setLoading] = useState(false)

	const history = useHistory()

	const toast = useToast()

	const postDetails = (pic) => {
		setLoading(true)
		if(!pic) {
			toast({
				title: "Please select an Image",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			})
			return
		}

		if(pic.type === 'image/jpeg' || pic.type === 'image/png') {
			const data = new FormData()
			data.append('file', pic)
			data.append('upload_preset', 'lets-chat-app')
			data.append('cloud_name', 'reetam01')
			fetch('https://api.cloudinary.com/v1_1/reetam01/image/upload', {
				method: 'post',
				body: data
			}).then((res) => res.json())
				.then((data) => {
					setImage(data.url.toString())
					setLoading(false)
					console.log(data)
				})
				.catch(err => {
					console.log(err)
					setLoading(false)
				})
		} else {
			toast({
				title: "Please select a file of type .jpeg/.png",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			})
			setLoading(false)
			return
		}
	}

	const submitHandler = async (e) => {
		setLoading(true)
		if(!name || !email || !password || !password2) {
			toast({
				title: "Please fill out all the fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			})
			setLoading(false)
			return
		}

		if(password !== password2) {
			toast({
				title: "Passwords do not match",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			})
			setLoading(false)
			return
		}

		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				}
			}

			const { data } = axios.post("/api/user", {name, email, password, pic: image}, config)
			toast({
				title: "Registration successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			})

			localStorage.setItem("userInfo", JSON.stringify(data))
			history.push('/chats')
			setLoading(false)
		} catch(error) {
			toast({
				title: "Error occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			})

			setLoading(false)
		}

	}

  return (
      <VStack spacing="5px">
          <FormControl id='first-name' isRequired>
              <FormLabel>
								Name
              </FormLabel>
              <Input
              onChange={(e) => setName(e.target.value)} 
              placeholder='Enter your name'
							/>
          </FormControl>
					<FormControl id='email' isRequired>
              <FormLabel>
								Email
              </FormLabel>
              <Input
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
							/>
          </FormControl>
					<FormControl id='password' isRequired>
              <FormLabel>
								Password
              </FormLabel>
							<InputGroup>
								<Input
								type={"password"}
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
					<FormControl id='confirm-password' isRequired>
              <FormLabel>
								Confirm Password
              </FormLabel>
							<InputGroup>
								<Input
								type={"password"}
								onChange={(e) => setPassword2(e.target.value)} 
								placeholder='Confirm Password'
								/>
								<InputRightElement width="4.5rem">
									<Button h="1.75rem" size="sm" colorScheme="">
										{show ? "Hide" : "Show"}
									</Button>
								</InputRightElement>

							</InputGroup>
          </FormControl>
					<FormControl id="pic" isRequired>
              <FormLabel>
								Upload your profile picture
              </FormLabel>
							<Input
							type="file"
							p={1.5}
							accept="image/*"
							onChange={(e) => postDetails(e.target.files[0])}
							/>
          </FormControl>

					<Button
					colorScheme="myOrange"
					width="100%"
					style={{marginTop: 15}}
					onClick={submitHandler}
					isLoading={loading}
					>
						Register
					</Button>
      </VStack>
  )
}

export default Signup