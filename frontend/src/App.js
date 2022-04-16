import { Button } from '@chakra-ui/react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePage';
import ChatProvider from './context/ChatProvider';

function App() {
  return (
    <div className="App">
      <Switch>
        {/* <ChatProvider> */}
          <Route exact path="/" component={HomePage}/>
          <Route path="/chats" component={ChatPage}/>
        {/* </ChatProvider> */}
      </Switch>
    </div>
  );
}

export default App;
