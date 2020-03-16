import { useState } from 'react'
import { shuffle } from '../../util/shuffle'

/**
 * Custom hook for cleanly handling the so-called `NOPE` easter egg. Allows re-rolling
 * the raffle with specified chance.
 * 
 * @param {Object[]}  triggerRoll           callback for setting the roll timeout
 * @param {Object}    options               additional options for controlling how the easter egg behaves
 * @param {number}    options.numberOfRolls how many rolls the raffle should take on re-roll
 * @param {number}    options.labelDuration how many rolls the "nope" label is visible
 * @param {number}    options.triggerChance the chance for the easter egg to trigger
 * 
 * @returns {Object[]} the returned value is a 2-tuple, containing the label visibility
 *                     state as the first item and a function to handle triggering the
 *                     feature. The function should be called every time a new value is
 *                     rolled. Use the visibility boolean to control e.g. label visibility.
 */
export const useNopeEasterEgg = (triggerRoll, {
  numberOfRolls = 15,
  labelDuration = 5,
  triggerChance = 0.025,
}) => {
  const [labelVisible, setLabelVisible] = useState(false)

  /**
   * Handles setting the easter egg status to hidden when it has been visible for
   * <code>labelDuration</code>.
   * @param {Object[]}  restaurants     an array containing the entries in the raffle
   * @param {number}    rollsRemaining  number of rolls remaining.
   * 
   * @returns {boolean} <code>true</code> if the easter egg triggered
   */
  const update = (restaurants, rollsRemaining) => {
    if (rollsRemaining === 0 && tryTrigger(triggerChance, restaurants)) {
      return true
    }

    const shouldHide = rollsRemaining + labelDuration < numberOfRolls
    if (shouldHide) {
      setLabelVisible(false)
    }

    return false
  }

  const tryTrigger = (triggerChance, restaurants) => {
    if (Math.random() < triggerChance) {
      setLabelVisible(true)
      triggerRoll(numberOfRolls, 0, shuffle(restaurants))

      return true
    }

    return false
  }

  return {
    active: labelVisible,
    updateAndTryTrigger: update
  }
}
