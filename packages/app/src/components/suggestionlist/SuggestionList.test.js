import React from 'react'
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import { SuggestionList, SuggestionEntry } from './SuggestionList'
import suggestionService from '../../services/suggestion'
import restaurantService from '../../services/restaurant'
import categoryService from '../../services/category'
import { actRender } from '../../test/utilities'

jest.mock('../../services/restaurant.js')
jest.mock('../../services/suggestion.js')
jest.mock('../../services/category.js')

const testCategories = [
  {
    id: 1,
    name: 'Salad'
  },
  {
    id: 2,
    name: 'Burger'
  },
  {
    id: 3,
    name: 'Hangover'
  }
]

const testRestaurants = [
  {
    name: 'Luigi\'s pizza',
    url: 'www.pizza.fi',
    id: 1,
    categories: [2]
  },
  {
    name: 'Pizzeria Rax',
    url: 'www.rax.fi',
    id: 2,
    categories: [1, 2]
  },
  {
    name: 'Ravintola Artjärvi',
    url: 'www.bestfood.fi',
    id: 3,
    categories: [1]
  },
  {
    name: 'Kalevankadun Salaattibaari',
    url: 'www.k-salaatti.fi',
    id: 4,
    categories: [1, 2, 3]
  }
]

const testSuggestions = [
  {
    type: 'ADD',
    id: 1,
    data: testRestaurants[0]
  },
  {
    type: 'ADD',
    id: 2,
    data: testRestaurants[1]
  },
  {
    type: 'REMOVE',
    id: 3,
    data: testRestaurants[2]
  },
  {
    type: 'EDIT',
    id: 4,
    data: testRestaurants[3]
  }
]

beforeEach(() => {
  jest.clearAllMocks()
  suggestionService.getAll.mockResolvedValue(testSuggestions)
  categoryService.getAll.mockResolvedValue(testCategories)

  restaurantService.getOneById.mockImplementation((id) => {
    const restaurant = testRestaurants[id - 1]
    return {...restaurant, categories: testCategories.filter(c => restaurant.categories.includes(c.id))}
  })
})

test('a suggestion is rendered if one exists', async () => {
  suggestionService.getAll.mockResolvedValue([testSuggestions[0]])
  restaurantService.getOneById.mockResolvedValue(testRestaurants[0])

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

test('if no suggestions are listed an alert message is rendered', async () => {
  suggestionService.getAll.mockResolvedValue([])

  const { queryByTestId } = await actRender(<SuggestionList />, ['/admin/suggestions'])

  const alertMessage = await queryByTestId('suggestionList-alertMessage')
  expect(alertMessage).toBeInTheDocument()
})

/**
 * BELOW: SuggestionEntry specific tests!
 */

test('pressing the approve button calls the provided callback', async () => {
  const mockOnApprove = jest.fn()
  const suggestion = testSuggestions[0]

  const { queryByTestId } = await actRender(
    <SuggestionEntry
      suggestion={suggestion}
      handleApprove={mockOnApprove}
      handleReject={jest.fn()} />,
    ['/admin/suggestions']
  )

  const approveButton = await queryByTestId('suggestionEntry-approveButton')
  fireEvent.click(approveButton)
  expect(mockOnApprove).toBeCalledWith(suggestion.id)
})

test('renders approve button', async () => {
  const suggestion = testSuggestions[0]

  const { queryByTestId } = await actRender(
    <SuggestionEntry
      suggestion={suggestion}
      handleApprove={jest.mock()}
      handleReject={jest.mock()} />,
    ['/admin/suggestions']
  )

  const approveButton = await queryByTestId('suggestionEntry-approveButton')
  expect(approveButton).toBeInTheDocument()
})

test('pressing the reject button calls the provided callback', async () => {
  const mockOnReject = jest.fn()
  const suggestion = testSuggestions[0]

  const { queryByTestId } = await actRender(
    <SuggestionEntry
      suggestion={suggestion}
      handleApprove={jest.fn()}
      handleReject={mockOnReject} />,
    ['/admin/suggestions']
  )

  const rejectButton = await queryByTestId('suggestionEntry-rejectButton')
  fireEvent.click(rejectButton)
  expect(mockOnReject).toBeCalledWith(suggestion.id)
})

test('renders reject button', async () => {
  const suggestion = testSuggestions[0]

  const { queryByTestId } = await actRender(
    <SuggestionEntry
      suggestion={suggestion}
      handleApprove={jest.mock()}
      handleReject={jest.mock()} />,
    ['/admin/suggestions']
  )

  const rejectButton = await queryByTestId('suggestionEntry-rejectButton')
  expect(rejectButton).toBeInTheDocument()
})

describe('The information within SuggestionEntry is rendered', () => {

  test('Suggestion type is rendered', async () => {
    const suggestion = testSuggestions[2]

    const { getByTestId } = await actRender(
      <SuggestionEntry
        suggestion={suggestion}
        handleApprove={jest.mock()}
        handleReject={jest.mock()} />,
      ['/admin/suggestions']
    )

    const typeElement = await getByTestId('suggestionEntry-type')
    expect(typeElement).toBeInTheDocument()
  })

  test('Name of the restaurant related to the suggestion is rendered', async () => {
    const suggestion = testSuggestions[2]

    const { getByTestId } = await actRender(
      <SuggestionEntry
        suggestion={suggestion}
        handleApprove={jest.mock()}
        handleReject={jest.mock()} />,
      ['/admin/suggestions']
    )

    const nameElement = await getByTestId('suggestionEntry-restaurantName')
    expect(nameElement).toBeInTheDocument()
  })

  test('Updated fields are not rendered for ADD type suggestions', async () => {
    const suggestion = testSuggestions[0]

    const { queryByTestId } = await actRender(
      <SuggestionEntry
        suggestion={suggestion}
        handleApprove={jest.mock()}
        handleReject={jest.mock()} />,
      ['/admin/suggestions']
    )

    const tableHeader = await queryByTestId('suggestionEntry-updated-th')
    const restaurantName = await queryByTestId('suggestionEntry-updated-restaurantName')
    const restaurantUrl = await queryByTestId('suggestionEntry-updated-restaurantUrl')
    const restaurantCategories = await queryByTestId('suggestionEntry-updated-restaurantCategories')

    expect(tableHeader).not.toBeInTheDocument()
    expect(restaurantName).not.toBeInTheDocument()
    expect(restaurantUrl).not.toBeInTheDocument()
    expect(restaurantCategories).not.toBeInTheDocument()
  })

  test('Updated fields are not rendered for REMOVE type suggestions', async () => {
    const suggestion = testSuggestions[2]

    const { queryByTestId } = await actRender(
      <SuggestionEntry
        suggestion={suggestion}
        handleApprove={jest.mock()}
        handleReject={jest.mock()} />,
      ['/admin/suggestions']
    )

    const tableHeader = await queryByTestId('suggestionEntry-updated-th')
    const restaurantName = await queryByTestId('suggestionEntry-updated-restaurantName')
    const restaurantUrl = await queryByTestId('suggestionEntry-updated-restaurantUrl')
    const restaurantCategories = await queryByTestId('suggestionEntry-updated-restaurantCategories')

    expect(tableHeader).not.toBeInTheDocument()
    expect(restaurantName).not.toBeInTheDocument()
    expect(restaurantUrl).not.toBeInTheDocument()
    expect(restaurantCategories).not.toBeInTheDocument()
  })

  test('Updated fields are rendered for EDIT type suggestions', async () => {
    const suggestion = testSuggestions[3]

    const { getByTestId } = await actRender(
      <SuggestionEntry
        suggestion={suggestion}
        handleApprove={jest.mock()}
        handleReject={jest.mock()} />,
      ['/admin/suggestions']
    )

    const tableHeader = await getByTestId('suggestionEntry-updated-th')
    const restaurantName = await getByTestId('suggestionEntry-updated-restaurantName')
    const restaurantUrl = await getByTestId('suggestionEntry-updated-restaurantUrl')
    const restaurantCategories = await getByTestId('suggestionEntry-updated-restaurantCategories')

    expect(tableHeader).toBeInTheDocument()
    expect(restaurantName).toBeInTheDocument()
    expect(restaurantUrl).toBeInTheDocument()
    expect(restaurantCategories).toBeInTheDocument()
  })
})
