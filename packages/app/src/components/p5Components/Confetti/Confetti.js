import React from 'react'
import P5Wrapper from '../Wrapper/P5Wrapper'
import confettiScript from '../../../scripts/confetti'

import './Confetti.css'

const Confetti = () => {
  return (
    <div data-testid='confetti' className='confetti'>
      <P5Wrapper script={confettiScript} canvasId='confetti-canvas' />
    </div>
  )
}

export default Confetti
