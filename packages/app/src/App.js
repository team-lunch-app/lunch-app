import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './App.css'
import { Route, Switch, Redirect, useHistory, Link } from 'react-router-dom'
import Randomizer from './components/Randomizer/Randomizer'
import AddForm from './components/Restaurants/AddForm'
import EditForm from './components/Restaurants/EditForm'
import NotFound from './components/error/NotFound'
import Statistics from './components/statistics/Statistics'
import Attributions from './components/Attributions/Attributions'
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
  const feedbackUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfJ5xgfitDjlvHMmcasz2atmjEu1UGwKmWdgWowcpRja0xn_g/viewform'

  const [token, setToken] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    authService.restoreUser()
    setToken(authService.getToken())
    setIsLoggedIn(token !== undefined)
  }, [token])

  return (
    <>
      <header className='main-navbar'>
        <NavBar loggedIn={isLoggedIn} changeLoginStatus={setIsLoggedIn} />
      </header>
      <section className='main-container'>
        <Switch>
          <Route exact path='/error/404' render={() => <NotFound />} />
          <Route exact path='/attributions' render={() => <Attributions />} />
          <Route exact path='/statistics' render={() => <Statistics />} />
          <Route exact path='/admin/password-reset' render={() => <PasswordReset reset />} />
          <Route exact path='/admin/change-password' render={() => <PasswordReset />} />

          <Route exact path='/' render={() => <Randomizer />} />
          <Route exact path='/add' render={() => <AddForm />} />
          <Route exact path='/edit/:id' render={({ match }) => <EditForm id={match.params.id} />} />
          <Route exact path='/restaurants' render={() => <RestaurantList />} />
          <Route exact path='/login' render={() => isLoggedIn
            ? <Redirect to={'/admin/suggestions'} />
            : <LoginForm changeLoginStatus={setIsLoggedIn} />} />
          <AdminRoute basePath='/admin' isLoggedIn={isLoggedIn} />
          <Route path="*" render={() => <Redirect to='/error/404' />} />
        </Switch>
      </section>
      <footer className='main-footer'>
        <Link to='/attributions' className="">About</Link>
        <a href={feedbackUrl} className=""> Give Feedback </a>
      </footer>

    </>
  )
}

const AdminRoute = ({ isLoggedIn, basePath }) =>
  <Route path="/admin" render={() =>
    <Switch>
      {!isLoggedIn && <Redirect to='/login' />}
      <Route exact path={`${basePath}/categories/add`} render={() => <CategoryForm onSubmit={categoryService.add} />} />
      <Route exact path={`${basePath}/categories/edit/:id`} render={({ match }) => <CategoryForm id={match.params.id} onSubmit={categoryService.update} />} />
      <Route exact path={`${basePath}/categories`} render={() => <CategoryList />} />
      <Route exact path={`${basePath}/suggestions`} render={() => <SuggestionList />} />
      <Route exact path={`${basePath}/users`} render={() => <UserList />} />
      <Route exact path={`${basePath}/users/register`} render={() => <RegisterForm onSubmit={(user) => authService.register(user)} />} />
      <Redirect to={'/admin/suggestions'} />
    </Switch>
  } />

AdminRoute.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  basePath: PropTypes.string.isRequired,
}

export default App
