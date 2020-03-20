import React, { useEffect } from 'react'
import foodScript from '../../scripts/food'
import p5 from 'p5'

const FoodModel = () => {

  useEffect(() => {
    new p5(foodScript, 'foodmodel-canvas')
  }, [])

  return (
    <>
      <div data-testid='foodmodel' className='foodmodel-canvas' id='foodmodel-canvas'></div>
    </>
  )
}

export default FoodModel
