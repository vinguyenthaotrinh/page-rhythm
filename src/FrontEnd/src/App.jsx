import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Background from "./components/Background.jsx"
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"
import ResetPass1 from "./components/ResetPass1.jsx"
import ResetPass2 from "./components/ResetPass2.jsx";
import NavBar from './NavBar.jsx';
import Home from './components/Home.jsx';
import MyLibrary from './components/MyLibrary.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <NavBar />
        {/* <Background /> */}
        {/* <Login/> */}
        {/* <Register/> */}
        {/* <ResetPass1/> */}
        {/* <ResetPass2/> */}
        {/* <NavBar /> */}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/mylibrary" element={<MyLibrary/>}/>
        </Routes>

      </div>

    </>
  )
}

export default App
