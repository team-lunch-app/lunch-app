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
Optional filter settings can be provided as an object in the request body. The object should contain the properties `type` and `categories`, though, if one of them or neither is provided, their values are defaulted to values described below.

In full, the request body should have the following shape:
```js
{
  type: String,
  categories: [
    "5e3934ee1c9d4400003d99a3",
    "5e3935521c9d4400003d99a4",
  ]
}
```

#### Filter Type
The filter type determines which restaurants in the database are selected for the drawing of a random restaurant. 

Currently available filter types are:
  - `some` - Restaurants with at least one of the provided filter categories are included in the draw.
  - `all` - Only restaurants that belong to all of the provided filter categories are included in the draw.
  - `none` - Restaurants with at least one of the provided filter categories are **excluded** from the draw.

If no filter type is provided in the request, the type will be set to `some` by default.

#### Filter Categories
Optional array of category ids can be provided in the filter settings object. For example providing
```json
categories: [
  "5e3934ee1c9d4400003d99a3",
  "5e3935521c9d4400003d99a4",
]
```
in the object body, would cause the request to apply the selected filter type with the categories provided.

If no categories to filter by are provided in the request, the value will default to an empty array - which, essentially, means that all restaurants are included in the draw.

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
    - `categories`: required, must be an array containing zero or more category IDs. IDs must be valid ObjectIDs.


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
