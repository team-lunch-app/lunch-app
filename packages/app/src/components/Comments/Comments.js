import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'
import commentService from '../../services/comment'
import './Comments.css'
import { FormatQuote } from '@material-ui/icons'

const Comments = ({ placeId }) => {
  const [restaurantReviews, setReviews] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const getReviews = async () => {
      if (placeId) {
        try {
          const reviews = await commentService.getCommentsForRestaurant(placeId)
          setReviews(reviews)
        } catch (error) {
          switch (error.response.status) {
            case 503:
              setError('Fetching reviews failed. Contact your admin about a possibly reached Google API query limit.')
              break
            case 404:
              setError(error.response.data.error)
              break 
            default:
              break
          }
        }
      }
    }
    getReviews()
  }, [placeId])



  return (
    <div data-testid='review-component' className='review-component'>
      {error && <Alert data-testid='error-msg-generic' variant='danger'>{error}</Alert>}
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
