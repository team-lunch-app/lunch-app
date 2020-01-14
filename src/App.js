import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

const App = () => {
  const [restaurantName, setRestaurantName] = useState(null)

  const changeRestaurantHandler = newText => event => {
    event.preventDefault()
    setRestaurantName(newText)
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p data-testid='Restaurant-Name'>
          {restaurantName
            ? `And the winner is: ${restaurantName}`
            : 'Press the button, I dare you!'}
        </p>
        <button
          className='Hangry-button'
          data-testid='Hangry-button'
          onClick={changeRestaurantHandler('Ravintola Artjärvi')}
        >
          I am hungry!
        </button>
      </header>
    </div>
  )
}

export default App
