import React, { useEffect } from 'react'
import p5 from 'p5'

const P5Wrapper = ({ script, canvasId }) => {
  useEffect(() => {
    new p5(script, canvasId)
  }, [script, canvasId])

  return (
    <div id={`${canvasId}`}></div>
  )
}

export default P5Wrapper
