import React, { useState, useEffect } from 'react'
import { Button, Alert, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import suggestionService from '../../services/suggestion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

import './SuggestionList.css'

export const SuggestionList = () => {
  const [suggestions, setSuggestions] = useState()

  useEffect(() => {
    suggestionService.getAll().then(setSuggestions)
  }, [suggestionService])

  if (suggestions === undefined || suggestions === null) {
    return <div data-testid='suggestionList-loading'>Loading...</div>
  }

  const handleReject = async (id) => {
    await suggestionService.reject(id)
    setSuggestions(suggestions.filter(s => s.id !== id))
  }
  const handleApprove = async (id) => {
    await suggestionService.approve(id)
    setSuggestions(suggestions.filter(s => s.id !== id))
  }

  return (
    <div data-testid='suggestionList'>
      <Link to='/'><Button data-testid='suggestionList-backButton'>Back</Button></Link>
      <h1 data-testid='suggestionList-title'>Pending Suggestions</h1>
      {suggestions.length === 0
        ? <Alert data-testid='suggestionList-alertMessage' variant='warning'>Sorry, No suggestions available :C</Alert>
        : suggestions.map((suggestion) => <SuggestionEntry key={suggestion.id} suggestion={suggestion} handleApprove={handleApprove} handleReject={handleReject} />)
      }
    </div>
  )
}

export const SuggestionEntry = ({ suggestion, handleApprove, handleReject }) => {
  return (
    <Card className='suggestion-entry' data-testid='suggestionList-entry'>
      <Card.Header className = {suggestion.type} >{suggestion.type}</Card.Header>
      <Card.Body>
        <Card.Title>{suggestion.data.name}</Card.Title>
        <Card.Subtitle>
          <a href={suggestion.data.url}>
            <span>{suggestion.data.url} <FontAwesomeIcon icon={faExternalLinkAlt} /></span>
          </a>
        </Card.Subtitle>
      </Card.Body>
      <Card.Body className='buttons'>
        <Button
          data-testid='suggestionEntry-approveButton'
          variant='warning'
          onClick={() => handleApprove(suggestion.id)}
          size='sm'
        >
          Approve
        </Button>
        <Button
          data-testid='suggestionEntry-rejectButton'
          variant='danger'
          onClick={() => handleReject(suggestion.id)}
          size='sm'
        >
          Reject
        </Button>
      </Card.Body>
    </Card>
  )
}

SuggestionList.propTypes = {

}

SuggestionEntry.propTypes = {
  suggestion: PropTypes.shape({
    id: PropTypes.any.isRequired,
    type: PropTypes.string.isRequired,
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string
    }).isRequired
  }),
  handleApprove: PropTypes.any.isRequired,
  handleReject: PropTypes.any.isRequired,
}
