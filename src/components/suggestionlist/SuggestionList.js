import React, { useState, useEffect } from 'react'
import { Button, Alert, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
//import SuggestionEntry from './SuggestionEntry'
import suggestionService from '../../services/suggestion'

const SuggestionList = () => {
  const [suggestions, setSuggestions] = useState()

  useEffect(() => {
    suggestionService.getAll().then(setSuggestions)
  }, [suggestionService])

  const removeRestaurant = async () => {
    /*
    if (!window.confirm(`Are you sure you want to remove "${suggestion.name}"?`)) {
      return
    }
 
    const result = await suggestionService.remove(suggestion.id)
    if (result && result.status === 204) {
      setRestaurants(suggestions.filter(r => r.id !== suggestion.id))
    }
    */
  }

  if (suggestions === undefined || suggestions === null) {
    return <div data-testid='suggestionList-loading'>Loading...</div>
  }

  return (
    <div data-testid='suggestionList'>
      <Link to='/'><Button data-testid='suggestionList-backButton'>Back</Button></Link>
      <h1 data-testid='suggestionList-title'>Restaurants</h1>
      {suggestions.length === 0
        ? <Alert data-testid='suggestionList-alertMessage' variant='warning'>Sorry, No suggestions available :C</Alert>
        : suggestions.map((suggestion) => <SuggestionEntry key={suggestion.id} suggestion={suggestion} onRemove={removeRestaurant} />)
      }
    </div>
  )
}

const SuggestionEntry = ({ suggestion }) => {
  return (
    <Card className='suggestion-entry' data-testid='suggestionList-entry'>
      <Card.Body>
        <span data-testid='suggestionEntry-name'>{suggestion.data.name}</span>
        <div className='buttons'>
          <Button
            data-testid='suggestionEntry-editButton'
            variant='warning'
            size='sm'
          >
            Edit
          </Button>
          <Button
            data-testid='suggestionEntry-removeButton'
            variant='danger'
            size='sm'
          >
            Remove
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

SuggestionList.propTypes = {

}

export default SuggestionList
