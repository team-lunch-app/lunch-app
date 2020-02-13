Endpoints: `/api/restaurants`
============================

Unless otherwise stated, the served **restaurant**-resources have the following shape.
```js
{
  id: ObjectId,
  name: string,
  url?: string,
  categories: [
    {
      id: ObjectId,
      name: string,
    },
  ],
}
```
Few gotchas:
 - `url` may be undefined
 - `categories`-list may be empty


`GET /api/restaurants/`
-----------------------
*"Get-all"* -endpoint, provides a list of all available *restaurant*-resources.

### Response

| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains an array of *restaurants*.


`GET /api/restaurants/:id`
--------------------------
*"Get-one"* -endpoint; Given an ID, returns the corresponding *restaurant*.

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains the requested *restaurant*.

### Errors
 - `Status: 404 Not Found` - if malformed or unknown ID is provided. Response body contains the error message.


`POST /api/restaurants/random`
------------------------------
Randomly selects one restaurant.

### Request
Optional array of category ids can be provided in the request body. For example providing
```json
[
  "5e3934ee1c9d4400003d99a3",
  "5e3935521c9d4400003d99a4",
]
```
in the request body, would cause the request to randomly select one restaurant from one of the categories provided, ignoring restaurants which do not belong in the given categories.

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains a randomly selected *restaurant*.

### Errors
 - `Status: 404 Not Found` - if no restaurants matching the criteria could be found. Response body contains the error message.


`POST /api/restaurants/`
------------------------
*add*-endpoint. Creates a new restaurant from data provided.

### Request
Accepts a *restaurant* json-object, without ID and with `categories` replaced with an array of category IDs.
```js
{
  name: string,
  url?: string,
  categories: [
    CategoryID_1,
    CategoryID_2,
    ...
  ],
}
```

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `201 OK`           |

Returns the added *restaurant* as the response body. Received restaurant is guaranteed to have an ID. Note that the category list is not populated. Fetch using `GET /api/restaurants/:id` if concrete categories are needed.

### Errors
 - `Status: 400 Bad Request` - if any of the required properties is not provided
 - `Status: 400 Bad Request` - if any of the properties fail to validate
    - `name`: required, must be string and within 3 to 240 characters long.
    - `url`: must be undefined or a string within 3 to 240 characters long.
    - `categories`: optional, must be an array containing zero or more category IDs. IDs must be valid ObjectIDs.


`PUT /api/restaurants/:id`
--------------------------
*Update*-endpoint; Provided a *restaurant* with an ID, updates the information for that restaurant. Partial updates are not supported. Validation for `PUT` behaves exactly the same as `POST`-request validation.

### Request
Accepts a *restaurant* json-object, without ID and with `categories` replaced with an array of category IDs.
```js
{
  id: ObjectId,
  name: string,
  url?: string,
  categories: [
    CategoryID_1,
    CategoryID_2,
    ...
  ],
}
```

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Status Code`  | `204 No Content`   |

### Errors
See `POST /api/restaurants/` for validation errors


`DELETE /api/restaurants/:id`
-----------------------------
*Delete*-endpoint, removes the *restaurant*-resource with corresponding ID.

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Status Code`  | `204 No Content`   |

### Errors
 - `Status: 400 Bad Request` - if the ID is not a valid ObjectId. Response body contains the error message.
 - `Status: 404 Bad Request` - if the ID is a valid ObjectId, but no resource is found. Response body contains the error message.
