import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

import Join from './components/join';
import Game from './components/game';


const App = () => (
  <Router>
    <Route path='/' exact component={Join} />
    <Route path='/game'  component={Game} />
  </Router>
);

// function App() {
//   return (
//     <div className="App">
      
//     </div>
//   );
// }

export default App;
