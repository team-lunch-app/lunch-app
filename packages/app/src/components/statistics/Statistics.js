import React from 'react'
import Doughnut from './Doughnut'

import styles from './Statistics.module.css'

const Statistics = () =>
  <div>
    <h1>Let&apos;s run the numbers!</h1>
    <Charts />
  </div>

const Charts = () => {
  const lazyData = [
    {
      label: 'Responsible users',
      num: 40,
    },
    {
      label: 'Slackers',
      num: 60,
    }
  ]

  const reRollData = [
    {
      label: 'Accepted',
      num: 80,
    },
    {
      label: 'Re-rolled',
      num: 20,
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.doughnuts}>
        <Doughnut title='Lazy vs. responsible' data={lazyData} />
        <Doughnut title='Accept vs. Re-roll' data={reRollData} />
      </div>
    </div>
  )
}


export default Statistics
