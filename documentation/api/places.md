Endpoints: `/api/places`
=============================

Provides access to autocompletion and restaurant details resources. All place IDs are Google Places API place IDs.


`GET /api/places/autocomplete/:text`
-----------------------
*"autocomplete"* -endpoint, provides a list autocompletion suggestions based on given input string.

### Response

| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains an arrray of object with shape
```js
[
  {
    "name": string,
    "address": string,
    "distance": number,
    "placeId": string
  },
  // ...
]
```

### Errors
 - `Status: 404 Not Found` - if no places were found with the search string
 - `Status: 503 Service Unavailable` - if the underlying Google API key has exhausted monthly quota


`GET /api/places/details/:place_id`
--------------------------
*"Details"* -endpoint; Given a valid Google Place ID, returns details of the corresponding place.

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains details of the requested place, as per [Google API documentation](https://developers.google.com/places/web-service/details#fields)

```js
{
  "attributions": [ /* HTML attributions */ ],
  "result": {
    // refer to Google Places API documentation
  }
}
```

### Errors
 - `Status: 404 Not Found` - if malformed or unknown ID is provided. Response body contains the error message.
 - `Status: 503 Service Unavailable` - if the underlying Google API key has exhausted monthly quota


`GET /api/places/details/reviews/:place_id`
--------------------------
*"reviews"* -endpoint; Given a valid Google Place ID, returns a rating and reviews of the corresponding place.
### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains details of the requested place, as per [Google API documentation](https://developers.google.com/places/web-service/details#fields)

```js
{
  "attributions": [ /* HTML attributions */ ],
  "result": {
    // refer to Google Places API documentation
  }
}
```

 - `Status: 404 Not Found` - if malformed or unknown ID is provided. Response body contains the error message.
 - `Status: 503 Service Unavailable` - if the underlying Google API key has exhausted monthly quota


`GET /api/places/details/photos/:place_id`
--------------------------
*"photos"* -endpoint; Given a valid Google Place ID, returns references to up to 10 photos of the corresponding place.

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains information about the photos of the requested place. The application's google service sets the maximum width and height to 360 pixels and the images will be scaled accordingly. The image will be scaled to match the smaller of the two dimensions. The information also includes the html attributions that have to be published with each image as well as the url for the photo. The binary data of the image is not returned. Go to [Google API documentation](https://developers.google.com/places/web-service/photos) for more information.

```js
{
  "height": integer,
  "html_attributions": [ /* HTML attributions */ ],
  "photo_reference": string,
  "width": integer,
  "url": string 
}
```

 - `Status: 404 Not Found` - if malformed or unknown ID is provided. Response body contains the error message.
 - `Status: 503 Service Unavailable` - if the underlying Google API key has exhausted monthly quota

 `GET /api/places/details/addform/:place_id`
--------------------------
*"Details"* -endpoint; Given a valid Google Place ID, returns the following details of the corresponding place. 'formatted_address,name,place_id,geometry,website'

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains details of the requested place, as per [Google API documentation](https://developers.google.com/places/web-service/details#fields)

```js
{
  "attributions": [ /* HTML attributions */ ],
  "result": {
    // refer to Google Places API documentation
  }
}
```

### Errors
 - `Status: 404 Not Found` - if malformed or unknown ID is provided. Response body contains the error message.
 - `Status: 503 Service Unavailable` - if the underlying Google API key has exhausted monthly quota

