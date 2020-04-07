import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import Chart from 'chart.js'

const roundToTwoDecimals = (x) => Math.round((x + Number.EPSILON) * 100) / 100

/**
 * Renders a doghnut chart from the data provided.
 */
const Doughnut = ({ title, data }) => {
  /** 
   * Reference to the chart canvas container. This is not directly related to React state (thus not useState),
   * as we only need this in order to tell the Chart.js where it should render. Chart.js handles the rendering
   * here, not React.
   */
  const chartRef = useRef()

  // Once the component is mounted, create the chart
  useEffect(() => {
    // Grab 2d canvas for Chart.js
    const context = chartRef.current.getContext('2d')

    // Read labels/values from input data
    const labels = data.map((entry) => entry.label)
    const nTotal = data.map((entry) => entry.num).reduce((a, b) => a + b, 0)
    const values = data.map((entry) => (nTotal > 0 ? roundToTwoDecimals(entry.num / nTotal) : 0.5) * 100)

    // Create the chart
    new Chart(context, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            backgroundColor: [
              'rgb(128, 255, 0)',
              'rgb(255, 51, 0)',
            ],
            data: values,
            borderWidth: 2
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: title,
          fontColor: 'white'
        },
        legend: {
          display: true,
          rtl: true,
          position: 'bottom',
          labels: {
            fontColor: 'white'
          }
        },
      }
    })
  }, [data, title])

  return (
    <div>
      <canvas width={400} height={400} ref={chartRef} />
    </div>
  )
}

Doughnut.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    num: PropTypes.number.isRequired,
  })).isRequired,
}

export default Doughnut
