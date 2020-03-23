import React, { useEffect } from 'react'
import { foodScript, setSpin } from '../../scripts/food'
import p5 from 'p5'

const FoodModel = ({ rolling }) => {
  useEffect(() => {
    new p5(foodScript, 'foodmodel-canvas')
  }, [])

  useEffect(() => {
    setSpin(rolling)
  }, [rolling])

  return (
    <>
      <div data-testid='foodmodel' className='foodmodel-canvas' id='foodmodel-canvas'></div>
    </>
  )
}

export default FoodModel
