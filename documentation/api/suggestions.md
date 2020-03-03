Endpoints: `/api/suggestions`
=============================
Allows creating, approving and rejecting suggestions for creating and removing restaurants.

`GET /api/suggestions/`
-----------------------
*"Get-all"* -endpoint, provides a list of all available *suggestion*-resources. Requires authentication. Returned suggestions have the following shape

```js
{
  id: ObjectId,
  type: 'ADD' | 'REMOVE',
  data: Restaurant,
}
```
`data`-property Restaurant is a full restaurant with all available properties.

### Response

| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Response body contains an array of *suggestions*.


`POST /api/suggestions/add`
---------------------------
Creates a new suggestion for adding a restaurant.

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
| `Status Code`  | `201 Created`      |

Returns the added *suggestion* as the response body.

### Errors
 - `Status: 400 Bad Request` - if any of the required properties is not provided
 - `Status: 400 Bad Request` - if any of the properties fail to validate
    - `name`: required, must be string and within 3 to 240 characters long.
    - `url`: must be undefined or a string within 3 to 240 characters long.
    - `categories`: optional, must be an array containing zero or more category IDs. IDs must be valid ObjectIDs.


`POST /api/suggestions/edit`
---------------------------
Creates a new suggestion for editing a restaurant.

### Request
Accepts a *restaurant* json-object, with ID and with `categories` replaced with an array of category IDs.
```js
{
  id: string,
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
| `Status Code`  | `201 Created`      |

Returns the added *suggestion* as the response body.

### Errors
 - `Status: 400 Bad Request` - if any of the required properties is not provided
 - `Status: 400 Bad Request` - if any of the properties fail to validate
    - `id`: required, must be a valid id referring to an existing restaurant in the database
    - `name`: required, must be string and within 3 to 240 characters long.
    - `url`: must be undefined or a string within 3 to 240 characters long.
    - `categories`: optional, must be an array containing zero or more category IDs. IDs must be valid ObjectIDs.


`POST /api/suggestions/remove`
---------------------------
Creates a new suggestion for removing a restaurant.

### Request
Accepts a *restaurant* json-object, with ID and with `categories` replaced with an array of category IDs.
```js
{
  id: string,
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
| `Status Code`  | `201 Created`      |

Returns the added *suggestion* as the response body.

### Errors
 - `Status: 400 Bad Request` - if any of the required properties is not provided
 - `Status: 400 Bad Request` - if any of the properties fail to validate
    - `id`: required, must be a valid id referring to an existing restaurant in the database
    - `name`: required, must be string and within 3 to 240 characters long.
    - `url`: must be undefined or a string within 3 to 240 characters long.
    - `categories`: optional, must be an array containing zero or more category IDs. IDs must be valid ObjectIDs.


`POST /api/suggestions/approve/:id`
-----------------------------------
Approves a suggestion with the given `id`. Requires authentication.

### Response - Add-request
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `201 Created`      |

Returns the created *restaurant* as the response body.

### Response - Edit-request
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

### Response - Remove-request
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `204 No Content`   |

### Errors
 - `Status: 404 Not Found` - if no suggestion is found with the given id or if the suggestion type does not match the existing ones (`ADD` / `EDIT` / `REMOVE`)


`POST /api/suggestions/reject/:id`
----------------------------------
Rejects a suggestion with the given `id`. Requires authentication.

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `204 Created`      |

