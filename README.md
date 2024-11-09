# 🪶 Quill 🪶

Quill is a full stack **work-in-progress** ~~real-time~~ chat application I am building.\
The backend is running NestJS with TypeORM for the database. It's mostly done, except I need to eventually get to the **real-time** part and add web sockets 😜\
I've still got to finish off the front end, add all the cool functionality you would expect from a chat app like Slack or Discord before this is done.

<figure>
  <img src="https://preview.redd.it/pleasestop-v0-txr7gptyv1ad1.jpeg?width=1080&crop=smart&auto=webp&s=abbfa10a91eb5c9d099c3128320fa150e7c4078c" alt="Big Plans." style="width:50%">
  <figcaption>> me thinking about all the things I want to do in this project </figcaption>
</figure>

## If for some reason you want to have a play in its current state, read on for instructions

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
FILE_UPLOAD_DESTINATION= # Untested, but the path where you want uploaded files to go
```

4. Create a database with the name you specified in `DB_NAME`
5. Run `yarn` to install all dependencies

## Run tasks

Once you've finished setting up, you can run it with the following commands:

```sh
yarn start:backend # Start the backend first
yarn start:frontend
```
