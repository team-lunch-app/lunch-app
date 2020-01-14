import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import App from './App'

test('renders the new restaurant button', () => {
  const { getByText } = render(<App />)
  const buttonElement = getByText(/I am hungry!/i)
  expect(buttonElement).toBeInTheDocument()
})

test('pressing the button changes the text', () => {
  const { queryByTestId } = render(<App />)
  const restaurantNameElement = queryByTestId(/restaurant-name/i)
  const originalText = restaurantNameElement.textContent

  fireEvent.click(queryByTestId(/hangry-button/i))
  expect(restaurantNameElement.textContent).not.toBe(originalText)
})
