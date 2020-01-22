import React from 'react'
import './App.css'
import { Route, Link, } from 'react-router-dom'
import { Nav, Navbar, Container } from 'react-bootstrap'
import Randomizer from './components/Randomizer'
import AddForm from './components/AddForm'
import restaurantService from './services/restaurant'
import RestaurantList from './components/RestaurantList'

const App = () => {
  const navbar = () => {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Lunch Application</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link data-testid='addForm-link' className='nav-link' to='/add'>
              Add a Restaurant
            </Link>
            <Link data-testid='restaurantList-link' className='nav-link' to='/restaurants'>
              List Restaurants
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  const homeView = () => {
    return (
      <>
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
    <>
      <header className='main-navbar'>
        {navbar()}
      </header>
      <section className='main-container'>
        <Route exact path="/" render={() => homeView()} />
        <Route path="/add" render={() => addFormView()} />
        <Route path="/restaurants" render={() => <RestaurantList restaurantService={restaurantService} />} />
      </section>
    </>
  )
}

export default App
