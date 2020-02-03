import { act, render } from '@testing-library/react'

export const actRender = async (element) => {
  let queryByTestId, getByTestId, queryAllByTestId, getAllByTestId, getByText, queryByText, getAllByText
  await act(async () => {
    const renderResult = render(element)
    queryByTestId = renderResult.queryByTestId
    queryByTestId = renderResult.queryByTestId
    getByTestId = renderResult.getByTestId
    queryAllByTestId = renderResult.queryAllByTestId
    getAllByTestId = renderResult.getAllByTestId
    getByText = renderResult.getByText
    queryByText = renderResult.queryByText
    getAllByText = renderResult.getAllByText
  })

  return { queryByTestId, getByTestId, queryAllByTestId, getAllByTestId, getByText, queryByText, getAllByText }
}
