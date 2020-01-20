import React, { useState } from 'react'

const AddForm = ({ restaurantService }) => {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const addRestaurant = (event) => {
    event.preventDefault()

    restaurantService.add(name, url)
    setName('')
    setUrl('')
    setVisible(!visible)
  }

  const form = () => {
    return (
      <form data-testid='addForm' onSubmit={(event) => addRestaurant(event)}>
        <input type='text' onChange={(event) => setName(event.target.value)} />
        <input type='text' onChange={(event) => setUrl(event.target.value)} />
        <button data-testid='addForm-cancelButton' onClick={() => setVisible(!visible)}>Cancel</button>
        <button data-testid='addForm-addButton' type='submit'>Add</button>
      </form>
    )
  }

  const button = () => {
    return (
      <button data-testid='visibilityToggle' onClick={() => setVisible(!visible)}>+</button>
    )
  }

  return (
    <div>
      {visible ? form() : button()}
    </div>
  )
}

export default AddForm
