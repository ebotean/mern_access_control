# Javascript Full Stack Project

## Goal
The goal of this app is to provide a management system for access authorization. A person identifies itself to the system and verifies if that person can access the location or not.

## What is expected?
Users can be identified by an UUIDv4. Validation can result in four statuses:
- **SUCCESS**: The user is able to enter or exit the building.
- **WARNING**: If the user can proceed with access but needs to pay attention to certain details (as credentials expiry).
- **ERROR**: If the user is not able to enter or exit the building due to not meeting a critical constraint.
- **FAILURE**: If the system is unable to validate the access.

## Behaviors
These are specific behaviors expected 
- The application should receive an access roughly every 7 seconds.
- Upon receiving an access, it should be immediately reflected in the UI.
- Users must be registered in the system, and their access must be logged for up to 3 days.

### Constraints
- Users may only enter if they are out of the building; may only exit if they are inside the building.

## Installation
The app can be installed by:
- Making sure **Node** version is `^18.20`
- Installing **Docker** and starting the daemon 
- Running `npm install` from the root project folder
- Run `docker-compose up`. This will ensure your databases (postgres & mongo) are set up. Check for errors and fix them before proceeding.
<!-- - Run `prisma db pull`.  -->
- Run `npx prisma db push`. This step sets up the schema for your databases.
- Run `npx prisma db seed`. Here we add users and accesses to the system. This will ensure we have data to start with.

By now you should be good to go. 

## Serving the app
Make sure you have followed the installation steps. From the root project folder:
- (if not already running) Run `docker-compose up -d`
- Run `npm start`

## Stack
- React.js
- Express.js
- Prisma
- Postgres
- MongoDB
- Docker