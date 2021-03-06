import React from 'react'
import { Nav, Navbar, Button } from 'react-bootstrap'
import Equalizer from '@material-ui/icons/Equalizer'
import Lock from '@material-ui/icons/Lock'
import LockOpen from '@material-ui/icons/LockOpen'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { appName } from '../config'
import './NavBar.css'

import authService from '../services/authentication'

const NavBar = ({ loggedIn, changeLoginStatus }) => {
  const history = useHistory()

  const logout = () => {
    authService.logout()
    changeLoginStatus(false)
    history.push('/')
  }

  const feedbackUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfJ5xgfitDjlvHMmcasz2atmjEu1UGwKmWdgWowcpRja0xn_g/viewform'

  return (
    <Navbar collapseOnSelect bg="light" expand="lg">
      <Navbar.Brand as={Link} href='#' to='/'>{appName}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} href='#' data-testid='addForm-link' to='/add'>
            {loggedIn
              ? 'Add a Restaurant'
              : 'Suggest a Restaurant'
            }
          </Nav.Link>
          <Nav.Link as={Link} href='#' data-testid='restaurantList-link' to='/restaurants'>
            {loggedIn
              ? 'Edit Restaurants'
              : 'Suggest Editing Restaurants'
            }
          </Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          {loggedIn &&
            <>
              <Nav.Link as={Link} href='#' data-testid='categoriesList-link' to='/admin/categories'>
                Edit Categories
              </Nav.Link>
              <Nav.Link as={Link} href='#' data-testid='suggestionList-link' to='/admin/suggestions'>
                Manage Pending Suggestions
              </Nav.Link>
              <Nav.Link as={Link} href='#' data-testid='userList-link' to='/admin/users'>
                Manage Users
              </Nav.Link>
            </>
          }
        </Nav>
        <Nav>
          <Nav.Link as={Link} href='#' to='/attributions' className="phone-only">
            About
          </Nav.Link>
          <Nav.Item href='#' className="phone-only">
            <a className="nav-link" href={feedbackUrl}>Give Feedback</a>
          </Nav.Item>
        </Nav>
        <Nav>
          <Nav.Link as={Link} href='#' data-testid='statistics-link' to='/statistics'>
            Statistics <Equalizer />
          </Nav.Link>
        </Nav>
        <Nav>
          {loggedIn
            ? <Button data-testid='logout-button' onClick={logout} variant="danger" className="ml-auto"><Lock /> Logout</Button>
            : <Button data-testid='admin-button' onClick={() => history.push('/login')} variant='outline-secondary' size='sm' className='ml-auto'><LockOpen /> Admin Login</Button>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

NavBar.propTypes = {
  loggedIn: PropTypes.bool,
  changeLoginStatus: PropTypes.func
}

export default NavBar
