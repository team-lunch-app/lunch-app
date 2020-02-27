import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

import './NotFound.css'

const NotFound = () =>
  <Card className='error-404-container' bg='light' border='danger'>
    <Card.Header>
      <h1>Oops! Nothing here :c</h1>
    </Card.Header>
    <Card.Body>
      <p>
        Link you used to navigate to this page was broken, or you manually provided an invalid URL
      </p>
      <p>
        <Link to='/'>Click here</Link> to return to the site.
      </p>
    </Card.Body>

  </Card>

export default NotFound
