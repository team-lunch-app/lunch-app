import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Doughnut from './Doughnut'
import Bar from './Bar'

import { shuffle } from '../../util/shuffle'

import statsService from '../../services/statistics'

import styles from './Statistics.module.css'

const Statistics = () => {
  const [stats, setStats] = useState()
  const [topAccepted, setTopAccepted] = useState()
  const [topResult, setTopResult] = useState()

  useEffect(() => {
    const fetchStats = async () => {
      setStats(await statsService.getAll())
      setTopAccepted(await statsService.getTopAccepted())
      setTopResult(await statsService.getTopResult())
    }

    fetchStats()
  }, [])

  if (!stats || !topAccepted || !topResult) {
    return <div>Loading...</div>
  }

  console.log('stats:', stats)

  return (
    <div className={styles.view}>
      <h1>Let&apos;s run the numbers!</h1>
      <Charts stats={stats} topAccepted={topAccepted} topResult={topResult} />
    </div>
  )
}

const Charts = ({ stats, topAccepted, topResult }) => {
  return (
    <div className={styles.container}>
      <TopAcceptedBars data={topAccepted} />
      <TopResultBars data={topResult} />
      <AcceptanceDoughnuts
        nLazy={stats.notDecidedAmount || 60}
        nResponsible={stats.selectedAmount || 40}
        nAccept={stats.selectedAmount || 80}
        nReRoll={stats.notSelectedAmount || 20} />
    </div>
  )
}

const AcceptanceDoughnuts = ({ nLazy, nResponsible, nAccept, nReRoll }) => {
  const lazyData = [
    { label: 'Responsible users', num: nResponsible, },
    { label: 'Slackers', num: nLazy, },
  ]
  const reRollData = [
    { label: 'Accepted', num: nAccept, },
    { label: 'Re-rolled', num: nReRoll, },
  ]

  return (
    <div className={styles.statistics}>
      <Doughnut title='Lazy vs. responsible' data={lazyData} />
      <Doughnut title='Accept vs. Re-roll' data={reRollData} />
      <p>
        {'This statistic visualizes the "laziness" of the users and the "acceptance rate" of the restaurant rolls. Laziness is the percentage of times when users did not press either of the "Ok, I\'m eating here" or "Nope, re-roll" -buttons. Acceptance rate is the ratio between accepted restaurants and re-rolls.'}
      </p>
    </div>
  )
}

const TopAcceptedBars = ({ data }) => {
  const parsedData = data.map(entry => (
    {
      label: entry.name,
      num: entry.selectedAmount,
    }
  ))
  shuffle(parsedData)

  return (
    <div className={styles.statistics}>
      <Bar title='Top Accepted' data={parsedData} />
      <p>
        {'This chart visualizes the top-5 acceptance counts for restaurants. This is the number of times the users have clicked the "Ok! I\'m going there" -button for the restaurant.'}
      </p>
    </div>
  )
}

const TopResultBars = ({ data }) => {
  const parsedData = data.map(entry => (
    {
      label: entry.name,
      num: entry.resultAmount,
    }
  ))
  shuffle(parsedData)

  return (
    <div className={styles.statistics}>
      <Bar title='Top Lottery Winners' data={parsedData} />
      <p>
        This chart visualizes the top-5 lottery winners. These are the restaurants that have most often ended up as the result displayed to user at the end of the lottery.
      </p>
    </div>
  )
}

Charts.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape({
    notDecidedAmount: PropTypes.number.isRequired,
    selectedAmount: PropTypes.number.isRequired,
    notSelectedAmount: PropTypes.number.isRequired,
  })).isRequired,
  topAccepted: PropTypes.array.isRequired,
  topResult: PropTypes.array.isRequired, 
}

AcceptanceDoughnuts.propTypes = {
  nLazy: PropTypes.number.isRequired,
  nResponsible: PropTypes.number.isRequired,
  nAccept: PropTypes.number.isRequired,
  nReRoll: PropTypes.number.isRequired,
}

TopResultBars.propTypes = {
  data: PropTypes.array.isRequired,
}

TopAcceptedBars.propTypes = {
  data: PropTypes.array.isRequired,
}

export default Statistics
