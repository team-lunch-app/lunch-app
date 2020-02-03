import React from 'react'
import './App.css'
import { Route, Link } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import Randomizer from './components/Randomizer'
import AddForm from './components/AddForm'
import restaurantService from './services/restaurant'
import RestaurantList from './components/RestaurantList'

const App = () => {
  const navbar = () => {
    return (
      <Navbar collapseOnSelect bg="light" expand="lg">
        <Navbar.Brand as={Link} href='#' to='/'>Lunch Application</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} href='#' data-testid='addForm-link' to='/add'>
              Add a Restaurant
            </Nav.Link>
            <Nav.Link as={Link} href='#' data-testid='restaurantList-link' to='/restaurants'>
              List Restaurants
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  return (
    <>
      <header className='main-navbar'>
        {navbar()}
      </header>
      <section className='main-container'>
        <Route exact path="/" render={() => <Randomizer />} />
        <Route path="/add" render={() => <AddForm />} />
        <Route path="/edit/:id" render={({ match }) => <AddForm id={match.params.id} />} />
        <Route path="/restaurants" render={() => <RestaurantList restaurantService={restaurantService} />} />
      </section>
    </>
  )
}

export default App
