import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import P5Wrapper from '../Wrapper/P5Wrapper'
import { foodScript, setSpin } from '../../../scripts/food'

const FoodModel = ({ rolling }) => {

  useEffect(() => {
    setSpin(rolling)
  }, [rolling])

  return (
    <div data-testid='foodmodel' className='foodmodel-canvas'>
      <P5Wrapper script={foodScript} canvasId='foodmodel-canvas' />
    </div>
  )
}

FoodModel.propTypes = {
  rolling: PropTypes.bool.isRequired,
}

export default FoodModel
