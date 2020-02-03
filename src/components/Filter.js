import React from 'react'
import PropTypes from 'prop-types'
import FilterList from './FilterList'
import CategoryDropdown from './CategoryDropdown'
import './Filter.css'

const Filter = ({ filterCategories, setFilterCategories, dropdownText, emptyMessage }) => {
  const handleRemove = (id) => {
    setFilterCategories(filterCategories.filter((category) => category.id !== id))
  }

  const handleAdd = (category) => {
    setFilterCategories(filterCategories.concat(category))
  }

  return (
    <div className='category-filter' data-testid='filter-dropdown'>
      <CategoryDropdown text={dropdownText} selected={filterCategories} onAdd={handleAdd} onRemove={handleRemove} />
      <FilterList selected={filterCategories} onRemove={handleRemove} emptyMessage={emptyMessage} />
    </div>
  )
}

Filter.propTypes = {
  filterCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  setFilterCategories: PropTypes.func.isRequired,
  emptyMessage: PropTypes.node.isRequired,
  dropdownText: PropTypes.string,
}

export default Filter
