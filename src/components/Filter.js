import React from 'react'
import PropTypes from 'prop-types'
import FilterList from './FilterList'
import CategoryDropdown from './CategoryDropdown'

const Filter = ({ filterCategories, setFilterCategories }) => {

  const handleRemove = (id) => {
    setFilterCategories(filterCategories.filter((category) => category.id !== id))
  }

  const handleAdd = (category) => {
    setFilterCategories(filterCategories.concat(category))
  }

  return (
    <>
      <FilterList selected={filterCategories} onRemove={handleRemove} />
      <div data-testid='filter-dropdown'>
        <CategoryDropdown selected={filterCategories} onAdd={handleAdd} onRemove={handleRemove} />
      </div>
    </>
  )
}

Filter.propTypes = {
  filterCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  setFilterCategories: PropTypes.func.isRequired
}

export default Filter
