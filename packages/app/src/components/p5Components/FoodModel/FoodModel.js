import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import P5Wrapper from '../Wrapper/P5Wrapper'
import { foodScript, setSpin, setRollsRemaining } from '../../../scripts/food'

import './FoodModel.css'

const FoodModel = ({ rolling, rollsRemaining }) => {

  useEffect(() => {
    setSpin(rolling)
  }, [rolling])

  useEffect(() => {
    setRollsRemaining(rollsRemaining)
  }, [rollsRemaining])

  return (
    <div data-testid='foodmodel' className='foodmodel-canvas'>
      <P5Wrapper script={foodScript} canvasId='foodmodel-canvas' />
    </div>
  )
}

FoodModel.propTypes = {
  rolling: PropTypes.bool.isRequired,
  rollsRemaining: PropTypes.number.isRequired
}

export default FoodModel
