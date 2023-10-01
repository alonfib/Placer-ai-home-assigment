import React from 'react';
import './App.css';
import { get } from './api';

function App() {

  const onClick = async () => {
    const data = await get('');
  }

  return (
    <div className="App">
      <button onClick={onClick}> send api request </button>
    </div>
  );
}

export default App;
