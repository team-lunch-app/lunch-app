import React from 'react'
import { fireEvent, within } from '@testing-library/react'
import { actRender } from '../../../test/utilities'
import SearchField from './SearchField'

test('when text is entered, filter calls the handler function', async () => {
  const mockHandleSearchStringChange = jest.fn()
  
  const { queryByTestId } = await actRender(<SearchField 
    handleSearchStringChange={mockHandleSearchStringChange}
    searchString={'xx'}
  />)
  
  const field = await queryByTestId('search-field')
  const input = within(field).getByTestId('input-field')
  fireEvent.change(input, { target: { value: 'zz' } })
  expect(mockHandleSearchStringChange).toBeCalled()
})
