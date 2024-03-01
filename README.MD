# Guide

## Requirements

-   install nodejs
-   install redis
-   install mysql

## Global Dependencies

### TypeScript

```sh
npm install typescript -g
```

### pm2

```sh
npm install pm2 -g
```

## Commands

## Environment Variables

### Main variables

Keys you will need for the main application

-   PORT: the port number of your api to run.
-   NODE_ENV: determine if the application is running on local or production.
-   API_KEY: key to access the main application
-   ENCRYPTION_KEY: key to encrypt data to all applications data
-   TOKEN_SECRET: key to generate token for registering users.

### Database variables

-   DB_PORT
-   DB_HOST
-   DB_NAME
-   DB_USER
-   DB_PASS

### AWS variables

-   AWS_BUCKET_NAME
-   AWS_BUCKET_REGION
-   AWS_USER_NAME
-   AWS_ACCESS_KEY_ID
-   AWS_SECRET_ACCESS_KEY

### Mailer variables

-   MAILER_HOST
-   MAILER_PORT
-   MAILER_EMAIL
-   MAILER_PASS

# Notes

-   Database host for local environment sometimes 'localhost' or '127.0.0.1' depending on machine.
