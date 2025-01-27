# 🪶 Quill 🪶

Quill is a full stack real-time chat application I have built for fun and to further my TypeScript abilities.\
The backend is running NestJS with TypeORM for the database. It has all the essential stuff working like real time messages, personalisation, group and private messaging.\

The base application is done, and you can clone this repo and get it running locally by following the below instructions. I have some stretch goals I hope to be able to implement in the future as I get time outside of work which are:

-   Audio/Video calling using WebRTC (no libraries)
-   Refactor the friend system so you can actually send a 'request' to become friends, and not just automatically add a friend 😆
-   Support advanced text features like hyperlinks and previews when sending this type of content
-   Add support for GIFs in messaging as well as reacting to messages
-   Notifications (unread messages, friend requests etc)

<figure>
  <img src="https://preview.redd.it/pleasestop-v0-txr7gptyv1ad1.jpeg?width=1080&crop=smart&auto=webp&s=abbfa10a91eb5c9d099c3128320fa150e7c4078c" alt="Big Plans." style="width:50%">
  <figcaption>> me thinking about all the things I want to do in this project </figcaption>
</figure>

## Project Configuration

There are a few pre-requisites you will need before starting in order for the project to build successfully:

1. **Yarn:** This project is using yarn, so if you wish to use another package manager you will need to update the scripts in `package.json`
2. **Postgres:** If you wish to use another db type, such as mysql, you will need to update `/apps/quill-backend/app/app.module.ts`
3. Create a `.env` file in `/apps/quill-backend` and populate it with the following

```sh
PORT=value_goes_here # The port the express server will run on
COOKIE_SECRET=value_goes_here # A good secret for session serialisation
COOKIE_MAX_AGE=86400000  # 24 Hours (Adjust as desired for a longer session time)
SESSION_NAME=quill_sessionID # Change if desired
DB_HOST=value_goes_here # Probably localhost, but depends on your configuration
DB_PORT=value_goes_here # Port for your database provider, mine is running in a docker container
DB_USERNAME=username # Your postgres user creds
DB_PASSWORD=password # Your postgres user creds
DB_NAME=quill # Change if desired
FILE_UPLOAD_DESTINATION= # The path where you want uploaded files to go, eg ~/User/{path_to_repo}/quill/assets/images
```

4. Create a `.env.local` file in `/apps/quill-frontend` and populate it with the following:

```sh
NEXT_PUBLIC_SOCKET_URI= Url the backend is running on, probably http://localhost:3001
```

5. Create a database with the name you specified in `DB_NAME`
6. Run `yarn` to install all dependencies

## Running Quill

Once you've finished setting up, you can run it with the following commands:

```sh
yarn start:backend # Start the backend first
yarn start:frontend
```
