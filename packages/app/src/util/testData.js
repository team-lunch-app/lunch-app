const getSuggestions = () => {
  return (
    {
      data: [
        {
          name: 'Caverna Restaurant',
          address: 'Caverna Restaurant, Yliopistonkatu, Helsinki, Finland',
          distance: 265,
          placeId: 'ChIJgWk_zoQJkkYRr0Ye0Tk7DF4',
        }]
    }
  )
}

const getRestaurant = () => {
  return (
    {
      data: {
        result: {
          formatted_address: 'Yliopistonkatu 5, 00100 Helsinki, Finland',
          geometry: {
            location: {
              lat: 60.16990200000001,
              lng: 24.9467298
            },
            viewport: {
              northeast: {
                lat: 60.1712086802915,
                lng: 24.94808478029151
              },
              southwest: {
                lat: 60.16851071970849,
                lng: 24.9453868197085
              }
            },
          },
          name: 'Caverna Restaurant',
          opening_hours: {
            open_now: true,
            periods: [
              {
                close: { day: 0, time: '1900' },
                open: { day: 0, time: '1200' }
              },
              {
                close: { day: 0, time: '1900' },
                open: { day: 0, time: '1200' }
              },
              {
                close: { day: 0, time: '1900' },
                open: { day: 0, time: '1200' }
              },
              {
                close: { day: 0, time: '1900' },
                open: { day: 0, time: '1200' }
              },
              {
                close: { day: 0, time: '1900' },
                open: { day: 0, time: '1200' }
              },
              {
                close: { day: 0, time: '1900' },
                open: { day: 0, time: '1200' }
              },
              {
                close: { day: 0, time: '1900' },
                open: { day: 0, time: '1200' }
              }
            ],
            weekday_text: [
              'Monday: 11:00 AM – 9:00 PM',
              'Tuesday: 11:00 AM – 9:00 PM',
              'Wednesday: 11:00 AM – 10:00 PM',
              'Thursday: 11:00 AM – 10:00 PM',
              'Friday: 11:00 AM – 12:00 AM',
              'Saturday: 12:00 PM – 12:00 AM',
              'Sunday: 12:00 – 7:00 PM',
            ]
          },
          photos: [
            {
              height: 3648,
              html_attributions: ['<a href=\'https://maps.google.com/maps/contrib/109132722862630807631\'>Caverna Restaurant</a>'],
              photo_reference: 'CmRaAAAA6N9BkN-9d8TSJ6zPmeauOJ3ckv99LmT1h1ck6Ntcjx0a_xGRgo-Py9yz0H3l2I_22JFIiucI5RfhnNzPhgmJ77ydgCq4cQfc-MkOIDDdCI64d4mFux8tRqKtzTPMk8t3EhCLPN6C28u9M7hR8MQCxsakGhSEssRPxL7djdPKi023rTlIwvxySQ',
              width: 5472,
            },
            {
              height: 315,
              html_attributions: ['<a href=\'https://maps.google.com/maps/contrib/109132722862630807631\'>Caverna Restaurant</a>'],
              photo_reference: 'CmRaAAAAABySUYqnq_y6FSzgHhgqrkEGKSirVzEPObvJbJlrlQ2_4MZLCnHzppOvzi6ZUZNIF0uIacA6r1E2V8Jw303iGlZ3p2fh-W9TAk8HOpV_Fp_ZR4OSWsTl_SWn5wngpT2iEhDN6AbO4h9AnSuzekez7dXgGhR5YFQkSmA4b4JHGonm1mANxWODQA',
              width: 851
            }
          ],
          place_id: 'ChIJgWk_zoQJkkYRr0Ye0Tk7DF4',
          website: 'http://www.caverna.fi/'
        }
      }
    }
  )
}


export default { getSuggestions, getRestaurant }
