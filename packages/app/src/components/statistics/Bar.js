import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import Chart from 'chart.js'

const roundToTwoDecimals = (x) => Math.round((x + Number.EPSILON) * 100) / 100

/**
 * Renders a bar chart from the data provided. For details on what's going on, see the doghnut component.
 */
const Bar = ({ title, data }) => {
  const chartRef = useRef()

  useEffect(() => {
    const context = chartRef.current.getContext('2d')

    const labels = data.map((entry) => entry.label)
    const nTotal = data.map((entry) => entry.num).reduce((a, b) => a + b, 0)
    const values = data.map((entry) => (nTotal > 0 ? roundToTwoDecimals(entry.num / nTotal) : 0.5) * 100)

    
    /**
     * Create strings with format `rgb(r, g, b)` where components are in range [0, 255]
     */
    const random255 = () => Math.round(Math.random() * 255)
    const getRandomColor = () => `rgb(${random255()}, ${random255()}, ${random255()}, 0.85)`

    new Chart(context, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            backgroundColor: [
              getRandomColor(),
              getRandomColor(),
              getRandomColor(),
              getRandomColor(),
              getRandomColor(),
            ],
            data: values,
            borderWidth: 4
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: title,
          fontColor: 'white',
          fontSize: '24'
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: 'white',
              fontSize: 18,
              stepSize: 10,
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white',
              fontSize: 14,
              stepSize: 1,
              beginAtZero: true
            }
          }]
        },
        legend: { display: false, },
      }
    })
  }, [data, title])

  return (
    <div>
      <canvas width={600} height={400} ref={chartRef} style={{maxWidth:"100vw"}} />
    </div>
  )
}

Bar.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    num: PropTypes.number.isRequired,
  })).isRequired,
}

export default Bar
