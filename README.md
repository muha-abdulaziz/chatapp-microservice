# Chat app tech

This is a chat app. It consistes of 3 micro services

![The System Diagram](documentation/system-digram.png)
![The Diagram Key](documentation/system-digram-key.png)

#

- [-] auth service - Responsible for regestring users, sign-in, generating access tokens ...etc
- [x] email service - Responsible for sending emails
- [-] chat service - Handles the chat logic

 The email service done.
 The auth service almost done.
 The chat service missing checking on auth token.

## Run the app

### Dependencies

This system depends on the following

- Kafka the message queue (all services)
- Redis database (chat service)
- Mongo database (chat and auth services)

However there is a docker-compose file, but it has an issue with kafka.

To run kafka using docker run the following.

```shell
docker run --name kafka-server     --network host     -e KAFKA_CFG_NODE_ID=0     -e KAFKA_CFG_PROCESS_ROLES=controller,broker     -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093     -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT     -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@127.0.0.1:9093     -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER     bitnami/kafka:latest
```

To run each service

```shell
cd services/<service-dir>
npm run start:dev
```

## A user scenario

- A new user should visit sign-up page to create a password.
- The system send an email to his/her email to valitate the email
  - The email contain a url to reset password page
- When a user goes to the reset password page
  - The system checks the token
  - If the token is invalid a forbedden response sent to the user
  - If the token is valid, the system creates the account
- When a user signs in
  - If the credentials are invalid, the system sends un-authorized response
  - If the credentials are valid, the sign-in pages redirects a user to the chat page
- When a user goes to the chat page
  - The system checks his access token
    - if it's invalid the system redirects a user to sign-in page
    - if the access token is valid, it show a user the latest 10 messages, and allow a user to send and resive messages

## The app flow

### Auth service

- When a user signs in or asks to forgot a password, the auth service sends an event throw kafka to the email service.
- When the auth service creats a new user it sends an event to the chat service with a user data.
- When a user signs in, the auth service redirects a user to the chat service, with the  email and access token

### Email service

- It listens for events sends from auth service, and if there is an event, it sends an email to the user.
- It receives from the auth service a user email and a url to make a user set his/her password

## Message service

- When it receives an event with a new user creation, it add the user in its database.
- When a chat service receives any request from the user, it sends a request to the auth service to check the validity of the access token.
- When a user request the chat page, the pages should contain the leatest 10 messages
- The latest messages should be cached in the redis.

## Known issues

- I used "ejs" as a template system in the auth service, and because it has no support for blocks (as I found) I couldn't structre the pages properly.
- The input validation happens as if the controller handles an API not an html template, so the validation error responses are in "json".
- I used "handlebars" as template system in the email service becouse "ejs" has a bug with "@nestjs-modules/mailer" module that used to handle sending emails
- In the reset password controller, it doesn't checks the match of "password" and "confirm password"
- The docker image need an enhancement to be production ready, as the image building happens on one stage, but it should be in 2 stages (in this case)
- The docker-compose file not production ready, it just for development, as the used images of redis, mongodb, zookepper and kafka may be not the best choise in the production case (or using dockerized images setup for them)
- The docker-compose may issues

## Creadits

- I made the email template using [https://maizzle.com/](maizzle)
- I get the form template from [https://colorlib.com/wp/template/login-form-18/](colorlib) License: CC BY 3.0
