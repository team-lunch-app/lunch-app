import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import authService from '../../services/authentication'

import List from '../List/List'
import ListEntry from '../List/ListEntry'

const UserList = () => {
  const [users, setUsers] = useState()
  const history = useHistory()

  useEffect(() => {
    authService.getAllUsers().then(users => setUsers(users))
  }, [])

  const handleChangePassword = async () => {
    history.push('/admin/change-password')
  }

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
          >
            {entry.id === authService.getUserId() &&
              <Button 
                variant='outline-warning'
                onClick={handleChangePassword}
              >
                Change password
              </Button>}
          </ListEntry>}
      />
    </div>
  )
}

export default UserList
