// import axios from 'axios'
// const baseUrl = '/api/comments'

// result.rating
// result.reviews.text
// result.reviews.rating
// result.reviews.author_name

const commentsForRestaurant = {
  rating: 1.5,
  reviews: [
    {
      rating: 2,
      author_name: 'Arska',
      text: 'Perunat oli jäässä ja sain ripulin.'
    },
    {
      rating: 1,
      author_name: 'Kake',
      text: 'Muuten olisin antanut viisi tähteä, mutta naapuripöydän hymyilevä seurue pilasi ravintolaelämyksen.'
    },
  ]
} 

const getCommentsForRestaurant = ( place_id ) => {
  // place_id is restaurant id for google API
  // response includes up to five (5) reviews and a rating
  return commentsForRestaurant
}

export default { getCommentsForRestaurant }
