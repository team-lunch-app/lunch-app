import React, { useEffect } from 'react'
import './App.css'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import Randomizer from './components/Randomizer/Randomizer'
import AddForm from './components/Restaurants/AddForm'
import EditForm from './components/Restaurants/EditForm'
import NotFound from './components/error/NotFound'
import PasswordReset from './components/auth/PasswordReset'
import RestaurantList from './components/Restaurants/RestaurantList/RestaurantList'
import LoginForm from './components/auth/LoginForm'
import CategoryForm from './components/Categories/CategoryForm/CategoryForm'
import CategoryList from './components/Categories/CategoryList/CategoryList'
import UserList from './components/users/UserList'
import NavBar from './components/NavBar'
import RegisterForm from './components/users/RegisterForm'
import { SuggestionList } from './components/suggestionlist/SuggestionList'

import categoryService from './services/category'
import authService from './services/authentication'

const App = () => {
  // HACK: Required to ensure triggering state update on every history.push(...) from components
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()

  useEffect(() => authService.restoreUser(), [])

  // Grab the token from authservice
  // components also using this independently: AddForm, RestaurantEntry
  // If caching the token is implemented, fix them too
  const token = authService.getToken()
  const isLoggedIn = token !== undefined

  const adminRoutes =
    <Route path="/admin" render={() =>
      <Switch>
        {!isLoggedIn && <Redirect to='/login' />}
        <Route exact path="/admin/categories/add" render={() => <CategoryForm onSubmit={categoryService.add} />} />
        <Route exact path="/admin/categories/edit/:id" render={({ match }) => <CategoryForm id={match.params.id} onSubmit={categoryService.update} />} />
        <Route exact path="/admin/categories" render={() => <CategoryList />} />
        <Route exact path="/admin/suggestions" render={() => <SuggestionList />} />
        <Route exact path="/admin/users" render={() => <UserList />} />
        <Route exact path="/admin/users/register" render={() => <RegisterForm onSubmit={(user) => authService.register(user)} />} />
        <Redirect to={'/admin/suggestions'} />
      </Switch>
    } />

  return (
    <>
      <header className='main-navbar'>
        <NavBar loggedIn={isLoggedIn} />
      </header>
      <section className='main-container'>
        <Switch>
          <Route exact path="/error/404" render={() => <NotFound />} />
          <Route exact path="/admin/password-reset" render={() => <PasswordReset reset />} />
          <Route exact path="/admin/change-password" render={() => <PasswordReset />} />

          <Route exact path="/" render={() => <Randomizer />} />
          <Route exact path="/add" render={() => <AddForm />} />
          <Route exact path="/edit/:id" render={({ match }) => <EditForm id={match.params.id} />} />
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
