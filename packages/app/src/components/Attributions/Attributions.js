import React from 'react'
import { Card } from 'react-bootstrap'
import './Attributions.css'

const Attributions = () => {

  const confirmLeave = (event) => {
    if (!window.confirm('This URL leads to an external website. Are you sure you want to leave?')) {
      event.preventDefault()
    }
  }

  return (
    <div className='attributions-container'>
      <h1 className='attributions-title'>This site uses these sounds:</h1>

      <Card className='attributions-card' bg='light'>
        <Card.Header as='h5'>TaDa! by jimhancock</Card.Header>
        <Card.Body>
          <Card.Text>Licensed under CC0</Card.Text>
          <Card.Link href="https://freesound.org/people/jimhancock/sounds/376318/"
            target="_blank"
            onClick={(event) => confirmLeave(event)}>
          Source
          </Card.Link> 
          <Card.Link href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            onClick={(event) => confirmLeave(event)}>
          License
          </Card.Link>
        </Card.Body>
      </Card>

      <Card className='attributions-card' bg='light'>
        <Card.Header as='h5'>Sad Trombone by benboncan</Card.Header>
        <Card.Body>
          <Card.Text>Licensed under Attribution</Card.Text>
          <Card.Link href="https://freesound.org/people/Benboncan/sounds/73581/" 
            target="_blank"
            onClick={(event) => confirmLeave(event)}>
          Source
          </Card.Link> 
          <Card.Link href="https://creativecommons.org/licenses/by/3.0/"
            target="_blank"
            onClick={(event) => confirmLeave(event)}>
          License
          </Card.Link>
        </Card.Body>
      </Card>
    </div>
  )}

export default Attributions
