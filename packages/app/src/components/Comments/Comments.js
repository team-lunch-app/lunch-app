import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import commentService from '../../services/comment'
import './Comments.css'
import { FormatQuote } from '@material-ui/icons'

const Comments = ({ placeId }) => {
  const [restaurantReviews, setReviews] = useState()

  useEffect(() => {
    const getReviews = async () => {
      if (placeId) {
        try {
          const reviews = await commentService.getCommentsForRestaurant(placeId)
          setReviews(reviews)
        } catch (error) {
          console.log(error)
        }
      }
    }
    getReviews()
  }, [placeId])

  return (
    <div data-testid='review-component' className='review-component'>
      {(restaurantReviews && restaurantReviews.reviews && restaurantReviews.rating)
        ? <>
          <h5 className='review-rating'>Average rating on Google: {restaurantReviews.rating}</h5>
          {restaurantReviews.reviews.map(rev =>
            <p key={rev.text}><FormatQuote />{rev.text} &mdash;&nbsp;{rev.author_name}</p>)}
        </>
        : <h5 data-testid='no-reviews'>No reviews yet...</h5>
      }
    </div>
  )
}

Comments.propTypes = {
  placeId: PropTypes.string
}

export default Comments
