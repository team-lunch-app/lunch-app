import React from 'react'
import confettiScript from '../../services/confetti'
import p5 from 'p5'

const Confetti = () => {
  new p5(confettiScript, 'confetti-canvas')

  return (
    <div className='confetti-canvas' id='confetti-canvas'></div>
  )
}

export default Confetti
