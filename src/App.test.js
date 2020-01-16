import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import App from './App'

test('randomizer exists', () => {
  const { queryByTestId } = render(<App />)
  const randomizer = queryByTestId('randomizer')
  expect(randomizer).toBeInTheDocument()
})