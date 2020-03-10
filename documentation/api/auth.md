Endpoints: `/api/auth`
======================

Provides access to authentication functions. One can use the `/login` endpoint to fetch an authentication token.

These endpoints do not directly provide any resources.

When an endpoint documentation states that it requires authentication, a valid authentication token needs to be attached in the respective requests' `authorization`-header, prefixed with *"bearer"*, e.g. `authorization: bearer <token string>`.


`POST /api/auth/login`
----------------------

*login*-endpoint. Provided with valid credentials, returns an authentication token.

### Request
Accepts a json-object containing login credentials.
```js
{
  username: string,
  password: string,
}
```

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Returns an authentication token wrapped into an json-object; that is, an object with shape
```js
{
  token: string,
  userId: ObjectId,
  passwordExpired: Boolean,
}
```

### Errors
 - `Status: 403 Forbidden` - if credentials are not valid


`POST /api/auth/users`
----------------------

*register*-endpoint. Requires authorization, registers a new admin. Usernames must be unique.

### Request
Accepts a json-object containing desired login credentials.
```js
{
  username: string,
  password: string,
}
```

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `201 Created`      |

Returns an user with shape
```js
{
  id: ObjectId,
  username: string,
}
```


`GET /api/auth/users`
----------------------

*get-All*-endpoint. Requires authorization. Gets a list of all users.

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Returns an array of users with shape
```js
[
  {
    id: ObjectId,
    username: string,
  },
  // ...
]
```

`POST /api/auth/users/password`
----------------------

*change password*-endpoint. Requires authorization. Changes the password for current user

### Request
Accepts a json-object containing login credentials. `password` is the current/old password.
```js
{
  newPassword: string,
  password: string,
}
```

### Response
| Header         | value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Status Code`  | `200 OK`           |

Request body contains error message in case of error. Errors occur as password validation errors if any are present.
