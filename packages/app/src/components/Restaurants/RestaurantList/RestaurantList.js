import React, { useState, useEffect } from 'react'
import { Alert, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import restaurantService from '../../../services/restaurant'
import authService from '../../../services/authentication'
import suggestionService from '../../../services/suggestion'
import List from '../../List/List'
import ListEntry from '../../List/ListEntry'
import Filter from '../../Filter/Filter/Filter'

import './RestaurantList.css'

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState()
  const [searchString, setSearchString] = useState('')
  const [filteredRestaurants, setFilteredRestaurants] = useState()
  const [filterCategories, setFilterCategories] = useState([])
  const history = useHistory()

  const token = authService.getToken()
  const isLoggedIn = token !== undefined

  useEffect(() => {
    restaurantService.getAll()
      .then(fetchedRestaurants => {
        fetchedRestaurants.sort((a, b) => a.name.localeCompare(b.name, 'fi'))
        setRestaurants(fetchedRestaurants)
        setFilteredRestaurants(fetchedRestaurants)
      })
  }, [])

  useEffect(() => {
    if (restaurants) {
      const restaurantsFilteredWithString = restaurants
        .filter(rest => rest.name.toLowerCase()
        .includes((searchString).toLowerCase()))
    
      const selectedCategories = filterCategories.map(c => c.name)
      
      const restaurantCategoryNamesToArray = (restaurantCategories) => {
        return restaurantCategories.map(c => c.name)
      }

      const restaurantsfilteredWithStringsAndCategories = restaurantsFilteredWithString.filter(r => {
        const categs = restaurantCategoryNamesToArray(r.categories)
        return selectedCategories.every(element => categs.indexOf(element) > -1)
      })
      setFilteredRestaurants(restaurantsfilteredWithStringsAndCategories)
    }
  }, [searchString, filterCategories, restaurants])

  const handleSearchStringChange = (event) => {
    setSearchString(event.target.value)
  }
  
  const removeRestaurant = async (restaurant) => {
    if (isLoggedIn) {
      if (!window.confirm(`Are you sure you want to remove "${restaurant.name}"?`)) {
        return
      }

      const result = await restaurantService.remove(restaurant.id)
      if (result && result.status === 204) {
        setRestaurants(restaurants.filter(r => r.id !== restaurant.id))
        setFilteredRestaurants(restaurants.filter(r => r.id !== restaurant.id))
      }
    } else {
      if (window.confirm(`Suggest the removal of ${restaurant.name}?`)) {
        await suggestionService.removeRestaurant(restaurant)
      }
    }
  }

  const editRestaurant = (restaurant) => {
    history.push(`/edit/${restaurant.id}`)
  }

  return (
    <div data-testid='restaurantList' className='restaurantList'>
      <h1 data-testid='restaurantList-title' className='restaurantList-title'>Restaurants</h1>
      <Form className='search-form'>
        <Form.Group className='search-field' data-testid='search-field' >
          <Form.Control
            placeholder='Search'
            onChange={handleSearchStringChange}
            value={searchString}
            data-testid='input-field'
          />
        </Form.Group>
        <Filter
          dropdownText='Categories'
          emptyMessage={'No categories selected'}
          filterCategories={filterCategories}
          setFilterCategories={setFilterCategories}
        />
      </Form>
      <List
        entries={filteredRestaurants}
        renderNoEntries={() => <Alert variant='warning'>Sorry, No restaurants available :C</Alert>}
        renderEntry={(restaurant) =>
          <ListEntry
            key={restaurant.id}
            item={restaurant}
            onClickRemove={removeRestaurant}
            onClickEdit={editRestaurant}
          />
        }
      />
    </div>
  )
}

export default RestaurantList
