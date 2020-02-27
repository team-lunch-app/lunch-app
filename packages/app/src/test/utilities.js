import React from 'react'
import { act, render } from '@testing-library/react'
import { Route, MemoryRouter } from 'react-router-dom'

export const actRender = async (element, initialEntries) => {
  let queryByTestId, getByTestId, queryAllByTestId, getAllByTestId, getByText, queryByText, getAllByText
  let path
  await act(async () => {
    const renderResult = render(
      <MemoryRouter initialEntries={initialEntries}>
        {element}
        <Route path='*' render={({ location }) => { path = location; return null }} />
      </MemoryRouter>
    )
    queryByTestId = renderResult.queryByTestId
    queryByTestId = renderResult.queryByTestId
    getByTestId = renderResult.getByTestId
    queryAllByTestId = renderResult.queryAllByTestId
    getAllByTestId = renderResult.getAllByTestId
    getByText = renderResult.getByText
    queryByText = renderResult.queryByText
    getAllByText = renderResult.getAllByText
  })

  return { queryByTestId, getByTestId, queryAllByTestId, getAllByTestId, getByText, queryByText, getAllByText, getPath: () => path }
}
