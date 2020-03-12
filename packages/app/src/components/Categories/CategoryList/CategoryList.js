import React, { useState, useEffect } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import categoryService from '../../../services/category'
import './CategoryList.css'
import List from '../../List/List'
import ListEntry from '../../List/ListEntry'

const CategoryList = () => {
  const [categories, setCategories] = useState()
  const history = useHistory()

  useEffect(() => {
    categoryService.getAll().then(setCategories)
  }, [])

  const removeCategory = async (category) => {
    if (!window.confirm(`Are you sure you want to remove "${category.name}"?`)) {
      return
    }

    const result = await categoryService.remove(category.id)
    if (result && result.status === 204) {
      setCategories(categories.filter(r => r.id !== category.id))
    }
  }

  const editCategory = (category) => {
    history.push(`/admin/categories/edit/${category.id}`)
  }

  return (
    <div data-testid='categoryList' className='categoryList'>
      <h1 data-testid='categoryList-title' className='categoryList-title'>Categories</h1>
      <div className='categoryList-buttonGroup'>
        <Link to='/admin/categories/add' className='categoryList-addButton'><Button className="add-category-button" data-testid='categoryList-addButton' variant='success'>Add a new category</Button></Link>
      </div>
      <List
        entries={categories}
        renderNoEntries={() => <Alert variant='warning'>Sorry, No categories available :C</Alert>}
        renderEntry={(entry) =>
          <ListEntry
            key={entry.id}
            item={entry}
            onClickRemove={removeCategory}
            onClickEdit={editCategory}
          />}
      />
    </div>
  )
}

export default CategoryList
