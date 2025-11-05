
// import { useRef,useState } from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Signup from './components/Signup';
import Login from './components/Login';
import Dasnboard from './components/Dasnboard';
import TopNavigation from './components/TopNavigation';
import Tasks from './components/Tasks';
import Messages from './components/Messages';
import Leaves from './components/Leaves';
import EditProfile from './components/EditProfile';

function App() {
  
  
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path='/dashboard' element={<Dasnboard/>}></Route>
      <Route path='/topNavigation' element={<TopNavigation/>}></Route>
      <Route path='/tasks' element={<Tasks/>}></Route>
      <Route path="/msges" element={<Messages/>}></Route>
      <Route path="/leaves" element={<Leaves/>}></Route>
      <Route path='/editProfile' element={<EditProfile/>}></Route>
     </Routes>
     </BrowserRouter>
          </div>
  );
}

export default App;
