import { Button } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import './App.css';
import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePage';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={HomePage}/>
      <Route path="/chat" component={ChatPage}/>
    </div>
  );
}

export default App;
