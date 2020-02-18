import React from 'react'
import { render, fireEvent, waitForElement, waitForElementToBeRemoved } from '@testing-library/react'
import { SuggestionList, SuggestionEntry } from './SuggestionList'
import suggestionService from '../../services/suggestion'
import { actRender } from '../../test/utilities'


jest.mock('../../services/restaurant.js')
jest.mock('../../services/suggestion.js')

const testSuggestion = {
  type: 'ADD',
  id: 1,
  data: {
    name: 'Luigi\'s pizza',
    url: 'www.pizza.fi',
    id: 1
  }
}

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

  const { queryByTestId } = await actRender(<SuggestionList />, ['/admin/suggestions'])

  const suggestion = await queryByTestId('suggestionList-entry')
  expect(suggestion).toBeInTheDocument()
})

test('multiple restaurants are rendered if more than one exist', async () => {
  const { queryAllByTestId } = await actRender(
    <SuggestionList />, ['/admin/suggestions']
  )

  const suggestions = await queryAllByTestId('suggestionList-entry')
  expect(suggestions.length).toBeGreaterThan(1)
})

test('pressing the approve button calls the provided callback', async () => {
  const mockOnApprove = jest.fn()
  const { queryByTestId } = await actRender(
    <SuggestionEntry
      suggestion={testSuggestion}
      handleApprove={mockOnApprove}
      handleReject={jest.fn()} />,
    ['/admin/suggestions']
  )

  const approveButton = await queryByTestId('suggestionEntry-approveButton')
  fireEvent.click(approveButton)
  expect(mockOnApprove).toBeCalledWith(testSuggestion.id)
})

test('renders approve button', async () => {
  const { queryByTestId } = await actRender(
    <SuggestionEntry
      suggestion={testSuggestion}
      handleApprove={jest.mock()}
      handleReject={jest.mock()} />,
    ['/admin/suggestions']
  )

  const approveButton = await queryByTestId('suggestionEntry-approveButton')
  expect(approveButton).toBeInTheDocument()
})

test('pressing the reject button calls the provided callback', async () => {
  const mockOnReject = jest.fn()
  const { queryByTestId } = await actRender(
    <SuggestionEntry
      suggestion={testSuggestion}
      handleApprove={jest.fn()}
      handleReject={mockOnReject} />,
    ['/admin/suggestions']
  )

  const rejectButton = await queryByTestId('suggestionEntry-rejectButton')
  fireEvent.click(rejectButton)
  expect(mockOnReject).toBeCalledWith(testSuggestion.id)
})

test('renders reject button', async () => {
  const { queryByTestId } = await actRender(
    <SuggestionEntry
      suggestion={testSuggestion}
      handleApprove={jest.mock()}
      handleReject={jest.mock()} />,
    ['/admin/suggestions']
  )

  const rejectButton = await queryByTestId('suggestionEntry-rejectButton')
  expect(rejectButton).toBeInTheDocument()
})

test('if no suggestions are listed an alert message is rendered', async () => {
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

  const { getByTestId, queryByTestId } = await actRender(<SuggestionList />, ['/admin/suggestions'])

  const rejectButton = await queryByTestId('suggestionEntry-rejectButton')
  fireEvent.click(rejectButton)

  await waitForElementToBeRemoved(() => getByTestId('suggestionList-entry'))

  const alertMessage = await queryByTestId('suggestionList-alertMessage')
  expect(alertMessage).toBeInTheDocument()
})
