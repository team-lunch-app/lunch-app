import React from 'react'
import { actRender } from '../../test/utilities'
import PhotoCarousel from './PhotoCarousel'
import photoService from '../../services/photo'
import photo from '../../services/photo'

jest.mock('../../services/photo')

const mockPhotos = [
  {
    html_attributions: [],
    url: 'www.url.com',
    photo_reference: 'abcdef',
    height: 100,
    width: 100
  },
]

beforeEach(() => {
  jest.clearAllMocks()
})
  
test('photo component renders', async () => {
  photoService.getAllPhotosForRestaurant.mockResolvedValue(mockPhotos)
  const { queryByTestId } = await actRender(<PhotoCarousel placeId={'abc'}/>)
  const photos = queryByTestId('photo-carousel')
  expect(photos).toBeInTheDocument()
})

test('if no photos are found, photo component is empty', async () => {
  photoService.getAllPhotosForRestaurant.mockResolvedValue(null)
  const { queryByTestId } = await actRender(<PhotoCarousel />)
  const photos = queryByTestId('photo-carousel')
  expect(photos).not.toBeInTheDocument()
})
