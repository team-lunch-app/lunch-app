import React, { useState, useEffect } from 'react'
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
    <Carousel data-testid='photo-carousel'>
      {restaurantPhotos.map(photo => 
      <Carousel.Item key={photo.photo_reference} className='photo'>
        <img src={photo.url} alt='The restaurant' />
      </Carousel.Item>)
      }
    </Carousel>
    }
    </div>
  )
}

export default PhotoCarousel
    