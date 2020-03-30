import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Carousel } from 'react-bootstrap'
import photoService from '../../services/photo'

import './PhotoCarousel.css'

const PhotoCarousel = ({ placeId }) => {
  const [restaurantPhotos, setRestaurantPhotos] = useState()
  const [index, setIndex] = useState(0)
  const [attributions, setAttributions] = useState()

  useEffect(() => {
    const getPhotos = async () => {
      if (placeId !== undefined) {
        const photos = await photoService.getAllPhotosForRestaurant(placeId)
        setRestaurantPhotos(photos)
        setAttributions(photos[0].html_attributions)
      } 
    } 
    getPhotos()
  }, [placeId])

  const handlePhotoChange = (newIndex) => {
    setIndex(newIndex)
    const getAttributions = restaurantPhotos[newIndex].html_attributions
    setAttributions(getAttributions)
  }

  return (
    <div className='photo-component'>
      {restaurantPhotos &&
      <Carousel
        activeIndex={index}
        onSelect={handlePhotoChange}
        slide='true'
        wrap='true'
        data-testid='photo-carousel' >
        {restaurantPhotos.map(photo => 
          <Carousel.Item key={photo.url} className='photo'>
            <img src={restaurantPhotos[index].url} alt='The restaurant' />
          </Carousel.Item>)
        } 
      </Carousel>
      }
      {restaurantPhotos &&
      <p className='attributions-link' data-testid='attributions-link'>Photo credits: 
        <span dangerouslySetInnerHTML={{ __html: attributions }}></span>
      </p>
      }
    </div>
  )
}

PhotoCarousel.propTypes = {
  placeId: PropTypes.string
}

export default PhotoCarousel
