import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from "react-router-dom";

import {AudioCard} from './components'
function App() {
  
  return (
    <>
      <div className="App">
        {/* <NavBar /> */}
        {/* <Background /> */}
        {/* <Login/> */}
        {/* <Register/> */}
        {/* <ResetPass1/> */}
        {/* <ResetPass2/> */}
        {/* <NavBar />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/mylibrary" element={<MyLibrary/>}/>
        </Routes> */}
        {/* <HomeBookCard/> */}
        {/* <ReviewBox/> */}
        <h1>Audio Playlist</h1>
      <AudioCard
        title="Song 1"
        artist="Artist 1"
        audioUrl="#"
      />
      <AudioCard
        title="Song 2"
        artist="Artist 2"
        audioUrl="#"
      />
      </div>

    </>
  )
}

export default App
