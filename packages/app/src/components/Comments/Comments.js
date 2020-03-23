import React from 'react'
import PropTypes from 'prop-types'
import commentService from '../../services/comment'
import './Comments.css'
import { FormatQuote } from '@material-ui/icons'

const Comments = ( place_id ) => {

  const restaurantReviews = commentService.getCommentsForRestaurant(place_id)
  const showReviews = restaurantReviews.rating !== undefined
  
  return (
    <div data-testid='review-component' className='review-component'>
      {showReviews &&
      <>
        <h5 className='review-rating'>Average rating: {restaurantReviews.rating}</h5>
        {restaurantReviews.reviews.map(rev => 
          <p key={rev.text}><FormatQuote />{rev.text} &mdash;&nbsp;{rev.author_name}</p>)}
      </>
      }
      {!showReviews && <h5 data-testid='no-reviews'>No reviews yet.</h5>}
    </div>
  )
}

Comments.propTypes = {
  place_id: PropTypes.string.isRequired
}

export default Comments
