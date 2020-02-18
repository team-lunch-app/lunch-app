import React, { useState, useEffect } from 'react'
import { Form, Button, ButtonToolbar, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import categoryService from '../../../services/category'


const CategoryForm = ({ onSubmit, id }) => {
  const createDefaultCategory = () => ({ name: '' })

  const [error, setError] = useState('')
  const [category, setCategory] = useState(!id ? createDefaultCategory() : undefined)
  const setName = (name) => setCategory({ ...category, name })
  const { register, handleSubmit, errors } = useForm()

  let history = useHistory()
  useEffect(() => {
    if (id) {
      categoryService
        .getOneById(id)
        .then(fetched => setCategory({
          ...fetched,
          name: fetched.name || '',
        }))
        .catch((e) => {
          e.response.status === 403 
            ? setError('You need to be logged in to edit categories')
            : setError('Could not find category with the given ID')
          setCategory(createDefaultCategory())
        })
    }
  }, [id])

  const saveCategory = async (data, event) => {
    event.preventDefault()

    try {
      if (onSubmit) {
        await onSubmit(category)
      }
      setError('')
      history.push('/admin/categories')
    }
    catch (e) {
      setError(e.response.data.error)
    }
  }
  

  return (
    <div data-testid='categoryForm'>
      {error && <Alert data-testid='categoryForm-errorMessage' variant='danger'>{error}</Alert>}
      {category ?
        <Form onSubmit={handleSubmit(saveCategory)} className='add-form'>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              data-testid='categoryForm-nameField'
              disabled={!category}
              type='text'
              name='name'
              defaultValue={category.name}
              onChange={(event) => setName(event.target.value)}
              ref={register({ required: true, minLength: 3, maxLength: 240 })} />
            {errors.name &&
                <Alert data-testid='categoryForm-nameErrorMessage' variant='danger'>
                  {errors.name.type === 'required' && <li>Category name cannot be empty!</li>}
                  {errors.name.type === 'minLength' && <li>Must be at least 3 characters</li>}
                  {errors.name.type === 'maxLength' && <li>Must be shorter than 240 characters</li>}
                </Alert>
            }
          </Form.Group>
          <ButtonToolbar>
            <Button
              data-testid='categoryForm-cancelButton'
              onClick={() => history.push('/admin/categories')}
              variant='secondary'
            >
                Cancel
            </Button>
            <Button
              data-testid='categoryForm-addButton'
              type='submit'
              variant='primary'
            >
              {id ? 'Update' : 'Add'}
            </Button>
          </ButtonToolbar>
        </Form>
        : 'Loading...'}
      
    </div>

  )
}

CategoryForm.propTypes = {
  id: PropTypes.any,
  onSubmit: PropTypes.func,
}

export default CategoryForm
