import React from 'react'
import './App.css'
import { Route, Link, Redirect, useHistory } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import Randomizer from './components/Randomizer'
import AddForm from './components/AddForm'
import restaurantService from './services/restaurant'
import categoryService from './services/category'

import RestaurantList from './components/RestaurantList'
import LoginForm from './components/auth/LoginForm'
import authService from './services/authentication'
import CategoryForm from './components/Categories/CategoryForm/CategoryForm'
import CategoryList from './components/Categories/CategoryList/CategoryList'
import { SuggestionList } from './components/suggestionlist/SuggestionList'

const App = () => {
  // HACK: Required to ensure triggering state update on every history.push(...) from components
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()
  const token = authService.getToken()
  const isLoggedIn = token !== undefined

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
            {isLoggedIn && 
             <Nav.Link as={Link} href='#' data-testid='categoriesList-link' to='/admin/categories'>
             List Categories
             </Nav.Link>
          
            }
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
        <Route path="/add" render={() => <AddForm onSubmit={restaurantService.add} />} />
        <Route path="/edit/:id" render={({ match }) => <AddForm id={match.params.id} onSubmit={restaurantService.update} />} />      
        <Route path="/restaurants" render={() => <RestaurantList />} />
        <Route path="/login" render={() => isLoggedIn
          ? <Redirect to={'/admin'} />
          : <LoginForm />} />
        <Route path="/admin" render={() => !isLoggedIn && <Redirect to={'/login'} />} />
        <Route path="/admin/categories/add" render={() => <CategoryForm onSubmit={categoryService.add} />} />
        <Route path="/admin/categories/edit/:id" render={({ match }) => <CategoryForm id={match.params.id}  onSubmit={categoryService.update} />} />
        <Route exact path="/admin/categories" render={() => <CategoryList /> } />
        <Route path="/admin/suggestions" render={() => isLoggedIn
          ? <SuggestionList/>
          : <Redirect to={'/login'} />} />

      </section>
    </>
  )
}

export default App
