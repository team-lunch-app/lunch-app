import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Carousel } from 'react-bootstrap'
import photoService from '../../services/photo'
 
import './PhotoCarousel.css'
 
const PhotoCarousel = ({ placeId }) => {
  const [restaurantPhotos, setRestaurantPhotos] = useState()
 
  useEffect(() => {
    const getPhotos = async () => {
      if (placeId !== undefined) {
        const photos = await photoService.getAllPhotosForRestaurant(placeId)
        setRestaurantPhotos(photos)
      }
    }
    getPhotos()
  }, [placeId])
 
  return (
    <div className='photo-component'>
      {restaurantPhotos &&
        <Carousel
          indicators={false}
          slide='true'
          wrap='true'
          data-testid='photo-carousel' >
          {restaurantPhotos.map(photo => {
            return (
              <Carousel.Item key={photo.url} className='photo'>
                <img  className="d-block w-100" src={photo.url} alt='The restaurant' />
                <Carousel.Caption dangerouslySetInnerHTML={{ __html: photo.html_attributions }} />
              </Carousel.Item>
            )
          })}
        </Carousel>
      }
    </div >
  )
}
 
PhotoCarousel.propTypes = {
  placeId: PropTypes.string
}
 
export default PhotoCarousel
