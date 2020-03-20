import React, { useEffect } from 'react'
import confettiScript from '../../scripts/confetti'
import p5 from 'p5'

import './Confetti.css'

const Confetti = () => {

  useEffect(() => {
    new p5(confettiScript, 'confetti-canvas')
  }, [])

  return (
    <>
      <div data-testid='confetti' className='confetti-canvas' id='confetti-canvas'></div>
    </>
  )
}

export default Confetti
