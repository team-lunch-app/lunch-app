Endpoints: `/api/categories`
=============================

Unless otherwise stated, the served **category**-resources have the following shape.
```js
{
  id: ObjectId,
  name: string,
  restaurants: [
    {
      id: ObjectId,
      name: string,
      url: string,
      categories: [categoryId1, categoryId2]
    },
  ],
}
```
Few gotchas:
 - `restaurants`-list may be empty
 - `restaurant.categories`-list may be empty


`GET /api/categories/`
-----------------------
*"Get-all"* -endpoint, provides a list of all available *category*-resources.

### Response

| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains an array of *categories*.


`GET /api/categories/:id`
--------------------------
*"Get-one"* -endpoint; Given an ID, returns the corresponding *category*.

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains the requested *category*.

Few gotchas:
- The `restaurants`-list of category objects will  only contain the restaurant IDs

### Errors
 - `Status: 404 Not Found` - if unknown ID is provided. Response body contains the error message.
 - `Status: 400 Bad Request` - if malformed ID is provided. Response body contains the error message.

`POST /api/categories/`
------------------------
*add*-endpoint. Creates a new category from data provided. Requires authentication.

### Request
Accepts a *category* json-object, with only the name field.
```js
{
  name: string,
}
```

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `201 Created`      |

Returns the added *category* as the response body. Received category is guaranteed to have an ID. Note that the restaurant list is empty.

### Errors
 - `Status: 400 Bad Request` - if any of the required properties is not provided
 - `Status: 400 Bad Request` - if any of the properties fail to validate
    - `name`: required, must be string and within 3 to 240 characters long.


`PUT /api/categories/:id`
--------------------------
*Update*-endpoint; Provided a *category* with an ID, updates the information for that category. Partial updates are not supported. Validation for `PUT` behaves exactly the same as `POST`-request validation. Requires authentication.

### Request
Accepts a *category* json-object, with ID and with `restaurants` replaced with an array of restaurant IDs.
```js
{
  id: ObjectId,
  name: string,
  restaurants: [
    restaurantID_1,
    restaurantID_2,
    ...
  ],
}
```

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Status Code`  | `204 No Content`   |

### Errors
See `POST /api/categories/` for validation errors


`DELETE /api/categories/:id`
-----------------------------
*Delete*-endpoint, removes the *category*-resource with the corresponding ID. Requires authentication.

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Status Code`  | `204 No Content`   |

### Errors
 - `Status: 400 Bad Request` - if the ID is a malformed ObjectId. Response body contains the error message.
 - `Status: 404 Not Found` - if the ID is a valid ObjectId, but no resource is found. Response body contains the error message.
