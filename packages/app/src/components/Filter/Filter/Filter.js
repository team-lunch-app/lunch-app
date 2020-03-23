import React from 'react'
import PropTypes from 'prop-types'
import { Card, InputGroup } from 'react-bootstrap'
import FilterList from '../FilterList/FilterList'
import FilterType from '../FilterType/FilterType'
import CategoryDropdown from '../CategoryDropdown/CategoryDropdown'
import DistanceFilter from '../DistanceFilter/DistanceFilter'
import './Filter.css'

const Filter = ({ filterCategories, setFilterCategories, filterType, setFilterType, distance, setDistance, showFilter, dropdownText, emptyMessage }) => {
  const handleRemove = (id) => {
    setFilterCategories(filterCategories.filter((category) => category.id !== id))
  }

  const handleAdd = (category) => {
    setFilterCategories(filterCategories.concat(category))
  }

  return filterType
    ?
    <>
      {
        showFilter &&
        <Card className='filter-container'>
          <Card.Header className='filter-title'> I only want restaurants that... </Card.Header>
          <Card.Body className='filter-typeselect' >
            <InputGroup>
              <InputGroup.Prepend> 
                <InputGroup.Text>
            Serve  
                </InputGroup.Text>
                <FilterType filterType={filterType} setFilterType={setFilterType} /> 
              </InputGroup.Prepend>
            </InputGroup>
            <InputGroup>
              <InputGroup.Prepend> 
                <InputGroup.Text>
            of the following
                </InputGroup.Text>         
                <CategoryDropdown text={dropdownText} selected={filterCategories} onAdd={handleAdd} onRemove={handleRemove} />  
              </InputGroup.Prepend>
            </InputGroup>           
          </Card.Body>
          <FilterList selected={filterCategories} onRemove={handleRemove} emptyMessage={emptyMessage} />
          <Card.Body className='distance-filter' data-testid='filter-distance'>
            <InputGroup>
              <InputGroup.Prepend> 
                <InputGroup.Text>
            Max distance:
                </InputGroup.Text>
                <DistanceFilter distance={distance} setDistance={setDistance} />
                <InputGroup.Text>
            meters
                </InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Card.Body>
        </Card>
      }
    </>
    :
    <div className='category-filter' data-testid='filter-dropdown'>
      <CategoryDropdown text={dropdownText} selected={filterCategories} onAdd={handleAdd} onRemove={handleRemove} />
      <FilterList selected={filterCategories} onRemove={handleRemove} emptyMessage={emptyMessage} />
    </div>
}

Filter.propTypes = {
  filterCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  setFilterCategories: PropTypes.func.isRequired,
  emptyMessage: PropTypes.node.isRequired,
  dropdownText: PropTypes.string,
  filterType: PropTypes.string,
  setFilterType: PropTypes.func,
  distance: PropTypes.string,
  setDistance: PropTypes.func,
  showFilter: PropTypes.bool
}

export default Filter
