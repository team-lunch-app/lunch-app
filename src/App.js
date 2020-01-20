import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Randomizer from './components/Randomizer'
import AddForm from './components/AddForm'

const App = ({ restaurantService }) => {

  return (
    <div className='App'>
      <header className='App-header'>
        <AddForm restaurantService={restaurantService} />
        <Randomizer restaurantService={restaurantService} />
      </header>
    </div>
  )
}

export default App
