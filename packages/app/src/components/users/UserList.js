import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import authService from '../../services/authentication'

import List from '../List/List'
import ListEntry from '../List/ListEntry'

const UserList = () => {
  const [users, setUsers] = useState()

  useEffect(() => {
    authService.getAllUsers().then(users => setUsers(users))
  }, [])

  return (
    <div data-testid='userlist'>
      <div className='userlist-controls'>
        <Link to='/admin'><Button data-testid='back-button'>Back</Button></Link>
        <Link to='/admin/users/register'><Button className="register-button" data-testid='register-button' variant='success'>
          Add a new user
        </Button></Link>
      </div>
      <h1 data-testid='title'>Users</h1>
      <List
        entries={users}
        renderEntry={(entry) =>
          <ListEntry
            key={entry.id}
            item={{ id: entry.id, name: entry.username }}
          />}
      />
    </div>
  )
}

export default UserList
