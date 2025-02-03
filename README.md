# Javascript Full Stack Project

## Goal
The goal of this app is to provide a management system for access authorization. A person identifies itself to the system and verifies if that person can access the location or not.

## What is expected?
Users can be identified by an UUIDv4. Validation can result in four statuses:
- **SUCCESS**: The user is able to enter or exit the building.
- **WARNING**: If the user can proceed with access but needs to pay attention to certain details (as credentials expiry).
- **ERROR**: If the user is not able to enter or exit the building due to not meeting a critical constraint.
- **FAILURE**: If the system is unable to validate the access.

Users must be registered in the system, and their access must be logged for up to 3 days.

### Constraints
- Users may only enter if they are out of the building; may only exit if they are inside the building.

## Stack
- React.js
- Express.js
- Prisma
- Postgres
- MongoDB
- Docker

The application receives an access roughly every 5 seconds.