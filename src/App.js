import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Randomizer from './components/Randomizer'

const App = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <Randomizer restaurantService={{}} />
      </header>
    </div>
  )
}

export default App
