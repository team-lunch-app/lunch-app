import React from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './DistanceFilter.css'

const DistanceFilter = ({ distance, setDistance }) => {
  return (
    <Form
      data-testid='distance-form'
      className='distance-form'
      onSubmit={(event) => event.preventDefault()}
    >
      <Form.Group data-testid='distance-field'
        className='distance-form-input'
      >
        <Form.Control
          className='distance-form-input-control'
          role='textbox'
          type='number'
          name='distance'
          min={0}
          defaultValue={distance}
          onChange={(event) => setDistance(''+ event.target.value)} />
      </Form.Group>
    </Form>
  )
}

DistanceFilter.propTypes = {
  distance: PropTypes.string,
  setDistance: PropTypes.func.isRequired
}
export default DistanceFilter
