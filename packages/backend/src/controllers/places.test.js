const supertest = require('supertest')
const app = require('../app')
const google = require('../services/google')

const dbUtil = require('../test/dbUtil')

jest.mock('../services/google')

const autocompleteQuery = 'fuku'
const autocompleteResponse = [
  {
    description: 'Fuku sushi, Mannerheimintie, Helsinki, Finland',
    distance_meters: 189,
    id: '78e9b5d0e37f12785f21a87cc1a0c60cd33d4e3a',
    matched_substrings: [{ length: 4, offset: 0 }],
    place_id: 'ChIJLxuNHssLkkYRE4g89GmS8_0',
    reference: 'ChIJLxuNHssLkkYRE4g89GmS8_0',
    structured_formatting: {
      main_text: 'Fuku sushi',
      main_text_matched_substrings: [{ length: 4, offset: 0 }],
      secondary_text: 'Mannerheimintie, Helsinki, Finland'
    },
    terms: [
      { offset: 0, value: 'Fuku sushi' },
      { offset: 12, value: 'Mannerheimintie' },
      { offset: 29, value: 'Helsinki' },
      { offset: 39, value: 'Finland' }
    ],
    types: ['restaurant', 'food', 'point_of_interest', 'establishment']
  },
  {
    description: 'Fuku Supreme, Leppävaarankatu, Espoo, Finland',
    distance_meters: 9055,
    id: '937f4f00caa140a670c32de544a30614d219ee6f',
    matched_substrings: [{ length: 4, offset: 0 }],
    place_id: 'ChIJxZrtjHj2jUYRUnc7prDjZaI',
    reference: 'ChIJxZrtjHj2jUYRUnc7prDjZaI',
    structured_formatting: {
      main_text: 'Fuku Supreme',
      main_text_matched_substrings: [{ length: 4, offset: 0 }],
      secondary_text: 'Leppävaarankatu, Espoo, Finland'
    },
    terms: [
      { offset: 0, value: 'Fuku Supreme' },
      { offset: 14, value: 'Leppävaarankatu' },
      { offset: 31, value: 'Espoo' },
      { offset: 38, value: 'Finland' }
    ],
    types: ['restaurant', 'food', 'point_of_interest', 'establishment']
  }
]

const detailsQuery = 'ChIJLxuNHssLkkYRE4g89GmS8_0'
const detailsResponse = {
  'attributions': [],
  'result': {
    'formatted_address': 'Mannerheimintie 18, 00100 Helsinki, Finland',
    'geometry': {
      'location': {
        'lat': 60.16920340000001,
        'lng': 24.9389156
      },
      'viewport': {
        'northeast': {
          'lat': 60.1705970302915,
          'lng': 24.9403847302915
        },
        'southwest': {
          'lat': 60.1678990697085,
          'lng': 24.9376867697085
        }
      }
    },
    'name': 'Fuku Helsinki',
    'opening_hours': {
      'open_now': false,
      'periods': [
        {
          'close': {
            'day': 0,
            'time': '2200'
          },
          'open': {
            'day': 0,
            'time': '1100'
          }
        },
        {
          'close': {
            'day': 1,
            'time': '2200'
          },
          'open': {
            'day': 1,
            'time': '1100'
          }
        },
        {
          'close': {
            'day': 2,
            'time': '2200'
          },
          'open': {
            'day': 2,
            'time': '1100'
          }
        },
        {
          'close': {
            'day': 3,
            'time': '2200'
          },
          'open': {
            'day': 3,
            'time': '1100'
          }
        },
        {
          'close': {
            'day': 4,
            'time': '2200'
          },
          'open': {
            'day': 4,
            'time': '1100'
          }
        },
        {
          'close': {
            'day': 5,
            'time': '2300'
          },
          'open': {
            'day': 5,
            'time': '1100'
          }
        },
        {
          'close': {
            'day': 6,
            'time': '2300'
          },
          'open': {
            'day': 6,
            'time': '1100'
          }
        }
      ],
      'weekday_text': [
        'Monday: 11:00 AM – 10:00 PM', 'Tuesday: 11:00 AM – 10:00 PM', 'Wednesday: 11:00 AM – 10:00 PM', 'Thursday: 11:00 AM – 10:00 PM', 'Friday: 11:00 AM – 11:00 PM', 'Saturday: 11:00 AM – 11:00 PM', 'Sunday: 11:00 AM – 10:00 PM'
      ]
    },
    'photos': [
      {
        'height': 2250,
        'html_attributions': [
          '<a href=\'https://maps.google.com/maps/contrib/102470036477190220549\'>Claudio Bucci</a>'
        ],
        'photo_reference': 'CmRaAAAA46-yJLhFgdjYK-AogTLTxL2uFVwhkEr1Ef7fBui951h5z_aD8VFUM57U06KTmFkLJ_TfbTFBdD7os0hgv9KOjDK8wa6firFtDF3Doq3XrVjT_nR2eOMDyOs2785GLEkrEhCymhutRWisiZnGgI9CxEFnGhRhLYjlA6HzIwzyYF5ndcJgvzVtew',
        'width': 4000
      },
      {
        'height': 2976,
        'html_attributions': [
          '<a href=\'https://maps.google.com/maps/contrib/118050262657914020677\'>程慧慧</a>'
        ],
        'photo_reference': 'CmRaAAAAZACyaR_gEm3lLJ0Zp5PxiArJLp6qA0zQ70bXqtJZMJvoTe_zaPL804N27jr6x7NIiivgyfhwb2h4oGw230k3z0UfELJdzGaVWkQRHTr9P9uP3g4PxZFTtbV5YE3_kM5xEhB12ZchhhXYxqj2Do14oCkIGhRjnNWWKkRS3jBhhwsWl0MNSbp1nA',
        'width': 3968
      },
    ],
    'place_id': 'ChIJLxuNHssLkkYRE4g89GmS8_0'
  }
}

let server
beforeEach(() => {
  jest.clearAllMocks()
  server = supertest(app)
})

test('successful autocomplete returns with status 200', async () => {
  google.autocomplete.mockResolvedValue(autocompleteResponse)

  await server
    .get(`/api/places/autocomplete/${autocompleteQuery}`)
    .expect(200)
})

test('over query limit autocomplete returns with status 503', async () => {
  const mockReject = new google.QueryLimitError('Monthly quota exceeded!')
  mockReject.name = 'QueryLimit'
  google.autocomplete.mockRejectedValue(mockReject)

  await server
    .get(`/api/places/autocomplete/${autocompleteQuery}`)
    .expect(503)
})

test('autocomplete parses the information correctly', async () => {
  google.autocomplete.mockResolvedValue(autocompleteResponse)

  const { body: contents } = await server
    .get(`/api/places/autocomplete/${autocompleteQuery}`)

  expect(contents).toMatchObject([
    {
      name: expect.stringMatching(/fuku sushi/i),
      address: expect.stringMatching(/Mannerheimintie/i),
      placeId: 'ChIJLxuNHssLkkYRE4g89GmS8_0',
      distance: 189,
    },
    {
      name: expect.stringMatching(/fuku supreme/i),
      address: expect.stringMatching(/Leppävaarankatu/i),
      placeId: 'ChIJxZrtjHj2jUYRUnc7prDjZaI',
      distance: 9055,
    }
  ])
})

test('successful details query returns with status 200', async () => {
  google.findDetails.mockResolvedValue(detailsResponse)

  await server
    .get(`/api/places/details/${detailsQuery}`)
    .expect(200)
})

test('over query limit details query returns with status 503', async () => {
  const mockReject = new google.QueryLimitError('Monthly quota exceeded!')
  mockReject.name = 'QueryLimit'
  google.findDetails.mockRejectedValue(mockReject)

  await server
    .get(`/api/places/details/${detailsQuery}`)
    .expect(503)
})

test('find details returns some relevant information', async () => {
  google.findDetails.mockResolvedValue(detailsResponse)

  const { body: contents } = await server
    .get(`/api/places/details/${detailsQuery}`)

  expect(contents.attributions).toHaveLength(0)
  expect(contents.result).toMatchObject({
    formatted_address: expect.stringMatching(/.*Mannerheimintie 18.*Helsinki.*/i),
    place_id: 'ChIJLxuNHssLkkYRE4g89GmS8_0',
    geometry: expect.objectContaining({
      location: {
        lat: 60.16920340000001,
        lng: 24.9389156
      }
    }),
  })
})
