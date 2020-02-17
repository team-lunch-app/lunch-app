import React from 'react'
import './App.css'
import { Route, Link, Redirect, useHistory } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import Randomizer from './components/Randomizer'
import AddForm from './components/AddForm'
import restaurantService from './services/restaurant'
import RestaurantList from './components/RestaurantList'
import LoginForm from './components/auth/LoginForm'
import authService from './services/authentication'

const App = () => {
  // HACK: Required to ensure triggering state update on every history.push(...) from components
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()

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

  const token = authService.getToken()
  const isLoggedIn = token !== undefined
  return (
    <>
      <header className='main-navbar'>
        {navbar()}
      </header>
      <section className='main-container'>
        <Route exact path="/" render={() => <Randomizer />} />
        <Route path="/add" render={() => <AddForm onSubmit={restaurantService.add} />} />
        <Route path="/edit/:id" render={({ match }) => <AddForm id={match.params.id} onSubmit={restaurantService.update} />} />
        <Route path="/restaurants" render={() => <RestaurantList restaurantService={restaurantService} />} />
        <Route path="/login" render={() => isLoggedIn
          ? <Redirect to={'/admin'} />
          : <LoginForm />} />
        <Route path="/admin" render={() => isLoggedIn
          ? <span>Admin Control Panel Thing (tm)</span>
          : <Redirect to={'/login'} />} />
      </section>
    </>
  )
}

export default App
