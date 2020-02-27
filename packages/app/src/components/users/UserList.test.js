import React from 'react'
import UserList from './UserList'
import authService from '../../services/authentication'

import { actRender } from '../../test/utilities'

jest.mock('../../services/authentication.js')

beforeEach(async () => {
  jest.clearAllMocks()
  authService.getAllUsers.mockResolvedValue([
    {
      id: 0,
      username: 'jaskajoku'
    },
    {
      id: 1,
      username: 'admin'
    },
  ])
})

test('renders the list', async () => {
  const { getByTestId } = await actRender(
    <UserList />,
    ['/admin/users']
  )

  expect(getByTestId('list')).toBeInTheDocument()
})

test('renders title', async () => {
  const { getByTestId } = await actRender(
    <UserList />,
    ['/admin/users']
  )

  expect(getByTestId('title')).toHaveTextContent(/users/i)
})

test('contains user names', async () => {
  const { getByTestId } = await actRender(
    <UserList />,
    ['/admin/users']
  )

  expect(getByTestId('list')).toHaveTextContent(/jaskajoku/i)
  expect(getByTestId('list')).toHaveTextContent(/admin/i)
})
