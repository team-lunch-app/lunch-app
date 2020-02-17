import React from 'react'
import { render, fireEvent, waitForElement, waitForElementToBeRemoved } from '@testing-library/react'
import SuggestionList from './SuggestionList'
import restaurantService from '../../services/restaurant'
import suggestionService from '../../services/suggestion'
import { actRender } from '../../test/utilities'

jest.mock('../../services/restaurant.js')
jest.mock('../../services/suggestion.js')


beforeEach(() => {
  jest.clearAllMocks()
  suggestionService.getAll.mockResolvedValue(
    [
      {
        type: 'ADD',
        id: 1,
        data: {
          name: 'Luigi\'s pizza',
          url: 'www.pizza.fi',
          id: 1
        }
      },
      {
        type: 'ADD',
        id: 2,
        data: {
          name: 'Pizzeria Rax',
          url: 'www.rax.fi',
          id: 2
        }
      },
      {
        type: 'REMOVE',
        id: 3,
        data: {
          name: 'Ravintola Artjärvi',
          url: 'www.bestfood.fi',
          id: 3
        }
      }
    ]
  )
})

test('a suggestion is rendered if one exists', async () => {
  suggestionService.getAll.mockResolvedValue([
    {
      type: 'REMOVE',
      id: 3,
      data: {
        name: 'Ravintola Artjärvi',
        url: 'www.bestfood.fi',
        id: 3
      }
    }
  ])

  const { queryByTestId, getByTestId } = await actRender(
    <SuggestionList />, ['/admin/suggestions']
  )

  //await waitForElementToBeRemoved(() => getByTestId('suggestionList-loading'))

  const suggestion = await queryByTestId('suggestionList-entry')
  expect(suggestion).toBeInTheDocument()
})

test('multiple restaurants are rendered if more than one exist', async () => {
  const { queryAllByTestId, getByTestId } = await actRender(
    <SuggestionList />, ['/admin/suggestions']
  )

  //await waitForElementToBeRemoved(() => getByTestId('suggestionList-loading'))

  const suggestions = await queryAllByTestId('suggestionList-entry')
  expect(suggestions.length).toBeGreaterThan(1)
})
