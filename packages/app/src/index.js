import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import restaurantService from './services/restaurant'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <Router>
    <App restaurantService={restaurantService} />
  </Router>,
  document.getElementById('root')
)