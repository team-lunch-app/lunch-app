import React from 'react'
import './App.css'
import { Nav, Navbar, Button } from 'react-bootstrap'
import { Route, Switch, Link, Redirect, useHistory } from 'react-router-dom'
import Randomizer from './components/Randomizer'
import AddForm from './components/AddForm'
import NotFound from './components/error/NotFound'
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

  const logout = () => {
    authService.logout()
    history.push('/')
  }

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
              <>
                <Nav.Link as={Link} href='#' data-testid='categoriesList-link' to='/admin/categories'>
                  List Categories
                </Nav.Link>
                <Nav.Link as={Link} href='#' data-testid='suggestionList-link' to='/admin/suggestions'>
                  Pending Suggestions
                </Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
        {isLoggedIn &&
            <Nav className="ml-auto">
              <Button data-testid='logout-button' onClick={logout} variant="danger" className="ml-auto">Logout</Button>
            </Nav> 
        }
      </Navbar>
    )
  }

  const adminRoutes =
    <Route path="/admin" render={() =>
      <Switch>
        {!isLoggedIn && <Redirect to='/login' />}
        <Route exact path="/admin/categories/add" render={() => <CategoryForm onSubmit={categoryService.add} />} />
        <Route exact path="/admin/categories/edit/:id" render={({ match }) => <CategoryForm id={match.params.id} onSubmit={categoryService.update} />} />
        <Route exact path="/admin/categories" render={() => <CategoryList />} />
        <Route exact path="/admin/suggestions" render={() => <SuggestionList />} />
        <Redirect to={'/admin/suggestions'} />
      </Switch>
    } />

  return (
    <>
      <header className='main-navbar'>
        {navbar()}
      </header>
      <section className='main-container'>
        <Switch>
          <Route exact path="/error/404" render={() => <NotFound />} />

          <Route exact path="/" render={() => <Randomizer />} />
          <Route exact path="/add" render={() => <AddForm onSubmit={restaurantService.add} />} />
          <Route exact path="/edit/:id" render={({ match }) => <AddForm id={match.params.id} onSubmit={restaurantService.update} />} />
          <Route exact path="/restaurants" render={() => <RestaurantList />} />
          <Route exact path="/login" render={() => isLoggedIn
            ? <Redirect to={'/admin/suggestions'} />
            : <LoginForm />} />
          {adminRoutes}

          <Route path="*" render={() => <Redirect to='/error/404' />} />
        </Switch>
      </section>
    </>
  )
}

export default App
