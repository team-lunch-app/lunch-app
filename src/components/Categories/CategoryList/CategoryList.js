import React, { useState, useEffect } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CategoryEntry from '../CategoryEntry/CategoryEntry'
import categoryService from '../../../services/category'
import './CategoryList.css'

const CategoryList = () => {
  const [categories, setCategories] = useState()

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

  // Show loading text when Categorys haven't yet been fetched
  if (categories === undefined || categories === null) {
    return <div data-testid='categoryList-loading'>Loading...</div>
  }

  return (
    <div data-testid='categoryList' className='categoryList'>
      <div className='categoryList-buttonGroup'>
        <Link to='/admin' className='categoryList-backButton'><Button data-testid='categoryList-backButton'>Back</Button></Link>
        <Link to='/admin/categories/add' className='categoryList-addButton'><Button className="add-category-button" data-testid='categoryList-addButton' variant='success'>Add a new category</Button></Link>
      </div>
      <h1 data-testid='categoryList-title' className='categoryList-title'>Categories</h1>
      {categories.length === 0
        ? <Alert data-testid='categoryList-alertMessage' variant='warning'>Sorry, No categories available :C</Alert>
        : categories.map((category) => <CategoryEntry key={category.id} category={category} onRemove={removeCategory} />)
      }
    </div>
  )
}

export default CategoryList
