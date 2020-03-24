import React from 'react'
import { actRender } from '../../test/utilities'
import Comments from './Comments'
import commentService from '../../services/comment'

jest.mock('../../services/comment')

const mockReviews = {
  rating: 4,
  reviews: [
    {
      rating: 5,
      author_name: 'Mace',
      text: 'Kiva tunnelma. Tullaan toistekin.'
    },
    {
      rating: 1,
      author_name: 'Kake',
      text: 'Muuten olisin antanut viisi tähteä, mutta naapuripöydän hymyilevä seurue pilasi ravintolaelämyksen.'
    },
  ]
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('comment component renders', async () => {
  commentService.getCommentsForRestaurant.mockResolvedValue(mockReviews)
  const { queryByTestId } = await actRender(<Comments placeId={'abc'}/>)
  const reviews = queryByTestId('review-component')
  expect(reviews).toBeInTheDocument()
})

test('if no comments are found, a message is shown', async () => {
  commentService.getCommentsForRestaurant.mockReturnValue({
    placeId: 'abc123'
  })
  const { queryByTestId } = await actRender(<Comments placeId={'abc123'}/>)
  const msg = queryByTestId('no-reviews')
  expect(msg).toBeInTheDocument()

})
