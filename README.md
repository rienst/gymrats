# Gymrats Fitness Tracker

## Environment variables

### `.env`

```
MONGODB_URL=mongodb://localhost:27017/myapp
PORT=4000
URL=http://localhost:3000
JWT_SECRET=verysecret
MAILER_AUTH_USER=bezos@myapp.com
MAILER_AUTH_PASSWORD=plsdonthackme
```

- `MONGODB_URL`: MongoDB server url
- `PORT`: The port the server will listen to
- `URL`: the URL of the client app
- `JWT_SECRET`: The secret used for creating JWT tokens
- `MAILER_AUTH_USER`: The Google username used for sending emails
- `MAILER_AUTH_PASSWORD`: The Google app-specific password used for sending emails

### `client/.env`

```
REACT_APP_API_BASE_URL=http://localhost:4000/api
REACT_APP_LS_TOKEN_KEY=myapp_token
```

- `REACT_APP_API_BASE_URL`: The base URL used to prefix request URLs
- `REACT_APP_LS_TOKEN_KEY`: The local storage key used to store the JWT authentication token
