import React from 'react'
import Pokemon from './components/pokemon'
import Shilloute from './components/Shilloute'
import { Route, Routes } from 'react-router'
import Home from './components/Home'

const App = () => {
  
  return (
    <div>
      <Routes>
       <Route path="/pokedle" element={<Pokemon/>}/> 
       <Route path="/" element={<Home/>}/> 
       <Route path="/guess-the-pokemon" element={<Shilloute/>}/> 
      </Routes>
    </div>
  )
}

export default App
