import React from 'react'
import { Nav, Navbar, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import authService from '../services/authentication'

const NavBar = ({ loggedIn }) => {
  const history = useHistory()

  const logout = () => {
    authService.logout()
    history.push('/')
  }

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
          {loggedIn &&
            <>
              <Nav.Link as={Link} href='#' data-testid='categoriesList-link' to='/admin/categories'>
                List Categories
              </Nav.Link>
              <Nav.Link as={Link} href='#' data-testid='suggestionList-link' to='/admin/suggestions'>
                Pending Suggestions
              </Nav.Link>
              <Nav.Link as={Link} href='#' data-testid='userList-link' to='/admin/users'>
                Users
              </Nav.Link>
            </>
          }
        </Nav>
      </Navbar.Collapse>
      {loggedIn &&
        <Nav className="ml-auto">
          <Button data-testid='logout-button' onClick={logout} variant="danger" className="ml-auto">Logout</Button>
        </Nav>
      }
    </Navbar>
  )
}

NavBar.propTypes = {
  loggedIn: PropTypes.bool,
}

export default NavBar
