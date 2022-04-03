import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {BrowserRouter} from 'react-router-dom'


const theme = extendTheme({
  colors: {
    myOrange: {
      50: "#fd5e53",
      100: "#fd5e53",
      500: "#fd5e53",
      600: "#fd5e53"
    },
    myGreen: {
      50: "#00CC66",
      100: "#00CC66",
      500: "#00CC66",
      600: "#00CC66"
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
      600: "#d19a66"
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
