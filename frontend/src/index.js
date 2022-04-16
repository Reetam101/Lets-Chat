import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {BrowserRouter} from 'react-router-dom'
import ChatProvider from './context/ChatProvider';


const theme = extendTheme({
  colors: {
    myOrange: {
      50: "#fd5e53",
      100: "#fd5e53",
      500: "#fd5e53",
      600: "#fd5e53"
    },
    myGreen: {
      50: "#9acd32",
      100: "#9acd32",
      500: "#9acd32",
      600: "#9acd32"
    },
    darkRed: {
      50: "#be5046",
      100: "#be5046",
      500: "#be5046",
      600: "#be5046"
    },
    darkYellow: {
      50: "#d19a66",
      100: "#d19a66",
      500: "#d19a66",
      600: "#d19a66",
      400: "#d19a66"
    }
  },
  components: {
    Skeleton: {
      colorSchemes: {
        'light-dark': {
          bg: '#3b3c36'
        }
      }
    },
    DrawerContent: {
      variants: {
        'bg-dark': {
          bg: {
            50: "#fd5e53",
            100: "#fd5e53",
            500: "#fd5e53",
            600: "#fd5e53"
          },
          color: 'whiteAlpha.400'
        }
      }
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
