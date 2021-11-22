# Gymrats

Gymrats started as an idea to build a fitness tracking app. The front-end uses React and Bootstrap. The back-end uses Node.js, Express and MongoDB with Mongoose. Both written in TypeScript.

It was my first time building a full stack MERN app and because of that, I refactored and learned from it a lot. When I finished the user management logic, I felt it was a good time to wrap this thing up and start new project, using what I learned and focussing more on scalability from the start.

## Features

- Node.js REST API with front-end in React
- User storage in MongoDB
- Secure password storage using bcrypt hashing
- Authorization token generation using JWT
- Email verification on sign up using nodemailer and JWT
- Password reset functionality, also using nodemailer and JWT

## Environment variables

### `.env`

```
MONGODB_URL=mongodb://localhost:27017/gymrats
PORT=4000
URL=http://localhost:3000
JWT_SECRET=verysecret
MAILER_AUTH_USER=bezos@myapp.com
MAILER_AUTH_PASSWORD=plsdonthackme
```

- `MONGODB_URL`: MongoDB server url
- `PORT`: The port the server will listen to
- `URL`: The URL of the client app
- `JWT_SECRET`: The secret used for creating JWT tokens
- `MAILER_AUTH_USER`: The Google username used for sending emails
- `MAILER_AUTH_PASSWORD`: The Google app-specific password used for sending emails

### `client/.env`

```
REACT_APP_API_BASE_URL=http://localhost:4000/api
REACT_APP_LS_TOKEN_KEY=myapp_token
```

- `REACT_APP_API_BASE_URL`: The base URL used to prefix back-end requests
- `REACT_APP_LS_TOKEN_KEY`: The local storage key used to store the JWT authentication token
