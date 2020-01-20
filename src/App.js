import React from 'react'
import './App.css'
import { Route, Link, } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Randomizer from './components/Randomizer'
import AddForm from './components/AddForm'

const App = ({ restaurantService }) => {

  const homeView = () => {
    return (
      <>
        <Link data-testid='addForm-link' to='/add'><Button >+</Button></Link>
        <Randomizer restaurantService={restaurantService} />
      </>
    )
  }

  const addFormView = () => {
    return (
      <>
        <AddForm restaurantService={restaurantService} />
      </>
    )
  }

  return (
    <div className='App'>
      <header className='App-header'>
          <Route exact path="/" render={() => homeView()} />
          <Route exact path="/add" render={() => addFormView()} />
      </header>
    </div>
  )
}

export default App
