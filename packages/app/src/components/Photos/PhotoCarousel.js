import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Carousel, Alert } from 'react-bootstrap'
import photoService from '../../services/photo'

import './PhotoCarousel.css'

const PhotoCarousel = ({ placeId }) => {
  const [restaurantPhotos, setRestaurantPhotos] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const photos = await photoService.getAllPhotosForRestaurant(placeId)
        setRestaurantPhotos(photos)
      } catch (error) {
        switch (error.response.status) {
          case 503:
            setError('Fetching photos failed. Contact your admin about a possibly reached Google API query limit.')
            break
          case 404:
            setError(error.response.data.error)
            break 
          default:
            break
        }
      }
    }
    getPhotos()
  }, [placeId])

  return (
    <>
      {error && 
        <Alert data-testid='error-msg-generic' variant='danger' className='photos-alert'>
          {error}
        </Alert>}
      {restaurantPhotos ?
        <Carousel
          indicators={false}
          slide='true'
          wrap='true'
          data-testid='photo-carousel' >
          {restaurantPhotos.map(photo => {
            return (
              <Carousel.Item key={photo.url} className='photo'>
                <a href={photo.url}>
                  <img className="d-block w-100" src={photo.url} alt='The restaurant' />
                </a>
                <Carousel.Caption dangerouslySetInnerHTML={{ __html: photo.html_attributions }} />
              </Carousel.Item>
            )
          })}
        </Carousel>
        : <div className="carousel-inner" />
      }
    </>
  )
}

PhotoCarousel.propTypes = {
  placeId: PropTypes.string
}

export default PhotoCarousel
