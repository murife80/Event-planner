import React from 'react';
import EventList from './components/EventList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import './components/App.css'


function App() {
  return (
    <div className="App">
      <h1>Event Planner</h1>
      <RegisterForm />
      <LoginForm />
      <EventList />
      
    </div>
  );
}

export default App;
