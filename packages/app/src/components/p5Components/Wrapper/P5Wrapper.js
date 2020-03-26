import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import p5 from 'p5'

const P5Wrapper = ({ script, canvasId }) => {
  useEffect(() => {
    new p5(script, canvasId)
  }, [script, canvasId])

  return (
    <div id={`${canvasId}`}></div>
  )
}

P5Wrapper.propTypes = {
  script: PropTypes.func.isRequired,
  canvasId: PropTypes.string.isRequired
}

export default P5Wrapper
