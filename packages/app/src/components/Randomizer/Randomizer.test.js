import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import { actRender } from '../../test/utilities'
import Randomizer from './Randomizer'
import restaurantService from '../../services/restaurant'
import locationService from '../../services/location'
import categoryService from '../../services/category'
import '../../services/confetti'

jest.mock('p5')

jest.mock('../../services/restaurant.js')
jest.mock('../../services/sound.js')
jest.mock('../../services/location.js')
jest.mock('../../services/confetti.js')

restaurantService.getAllMatches.mockResolvedValue([{
  name: 'Luigi\'s pizza',
  url: 'www.pizza.fi',
  id: 1,
  distance: 1000,
  coordinates: { latitude: 60.17, longitude: 24.94 }
}])
window.HTMLMediaElement.prototype.play = () => { }

jest.mock('../../services/category.js')
categoryService.getAll.mockResolvedValue([{ id: 3, name: 'salads' }])
locationService.getLeg.mockResolvedValue({
  duration: 1660,
  distance: 1956.084,
  legGeometry: { length: 114, points: 'o}fnJ{ofwCM?K@Q@e@Vk@pA?V@z@S@@j@@f@?BA@oBpAEJ…s@t@G?IHIHALeAfAAAGFEFEDGFIJ{AjBaB|Bw@hAw@lAU^Ym@' },
  from: { lat: 60.17, lon: 24.941944 },
  to: { lat: 60.182315, lon: 24.922893 }
})

const TestRandomizer = () =>
  <Randomizer
    maxNumberOfRolls={10}
    maxTimeBetweenRolls={1}
    minTimeBetweenRolls={0}
    resultWaitTime={0}
  />

test('button for starting the raffle exists', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  const buttonElement = queryByTestId(/randomizer-randomizeButton/i)
  expect(buttonElement).toBeInTheDocument()
})

test('restaurant result label exists', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  const labelElement = queryByTestId(/randomizer-resultLabel/i)
  expect(labelElement).toBeInTheDocument()
})

test('restaurant result label is not empty initially', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  const labelElement = queryByTestId(/randomizer-resultLabel/i)
  expect(labelElement).not.toBeEmpty()
})

test('restaurant url is not rendered initially (no restaurant is shown)', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  const url = queryByTestId(/randomizer-restaurantUrl/i)
  expect(url).not.toBeInTheDocument()
})

test('restaurant url is rendered after a restaurant is drawn', async () => {
  const { queryByTestId, getByTestId } = await actRender(<TestRandomizer />)
  await act(async () => fireEvent.click(queryByTestId(/randomizer-randomizeButton/i)))
  expect(getByTestId(/randomizer-restaurantUrl/i)).toBeInTheDocument()
})

test('pressing the button calls the restaurant service', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  await act(async () => fireEvent.click(queryByTestId(/randomizer-randomizeButton/i)))
  expect(restaurantService.getAllMatches).toBeCalled()
})

test('pressing the button changes the text', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  const restaurantNameElement = queryByTestId(/randomizer-resultLabel/i)
  const originalText = restaurantNameElement.textContent
  await act(async () => fireEvent.click(queryByTestId(/randomizer-randomizeButton/i)))

  const newLabelElement = queryByTestId(/randomizer-resultLabel/i)
  expect(newLabelElement).not.toHaveTextContent(originalText)
})

test('user is not redirected to an external website if not confirmed', async () => {
  const { queryByTestId, getByTestId } = await actRender(<TestRandomizer />)
  window.confirm = jest.fn(() => false)
  await act(async () => fireEvent.click(queryByTestId(/randomizer-randomizeButton/i)))
  await act(async () => fireEvent.click(getByTestId(/randomizer-restaurantUrl/i)))
  expect(queryByTestId(/randomizer-restaurantUrl/i)).toBeInTheDocument()
})

test('map is not shown by default', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  expect(queryByTestId('map')).not.toBeInTheDocument()
})

test('map is shown after roll', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  await act(async () => fireEvent.click(queryByTestId(/randomizer-randomizeButton/i)))
  expect(queryByTestId(/map/i)).toBeInTheDocument()
})

test('confetti component is not shown by default', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  expect(queryByTestId(/confetti/i)).not.toBeInTheDocument()
})

test('confetti component is shown after roll', async () => {
  const { queryByTestId } = await actRender(<TestRandomizer />)
  await act(async () => fireEvent.click(queryByTestId(/randomizer-randomizeButton/i)))
  expect(queryByTestId(/confetti/i)).toBeInTheDocument()
})
