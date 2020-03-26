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

### Errors
 - `Status: 500 Internal Server Error` - if malformed ID is provided. Response body contains the error message.
 - `Status: 503 Service Unavailable` - if the underlying Google API key has exhausted monthly quota
