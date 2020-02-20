import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'

const List = ({ entries, renderNoEntries, renderEntry }) => {
  const noEntries = () => !renderNoEntries
    ? <Alert variant='warning' role='alert'>The list is empty :c</Alert>
    : renderNoEntries()

  // FIXME: Render "loading" when entries is undefined

  return (
    <div data-testid='list'>
      {(!entries || entries.length === 0)
        ? noEntries()
        : entries.map((entry) => renderEntry(entry))
      }
    </div>
  )
}

List.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.any.isRequired,
  })),
  renderNoEntries: PropTypes.any,
  renderEntry: PropTypes.any.isRequired,
}

export default List
