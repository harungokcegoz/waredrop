# Digital Closet API

This project is a Node.js/Express API for a Digital Closet application. It provides endpoints for user management, item management, outfit creation, social interactions, and more.

## Table of Contents

- [Digital Closet API](#digital-closet-api)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Running the Application](#running-the-application)
    - [Locally](#locally)
    - [On AWS](#on-aws)
    - [On Docker](#on-docker)
  - [Running Tests](#running-tests)
  - [API Documentation](#api-documentation)
  - [Sample Credentials](#sample-credentials)
  - [Environment Variables](#environment-variables)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (usually comes with Node.js)
- Docker and Docker Compose
- AWS CLI (for AWS deployment)
- Terraform (for AWS infrastructure management)


## Running the Application

So the application can be run locally, on AWS, or using Docker. 

### Locally

1. Start the server:
   ```
   bash ./build.sh
   ```

   This command will initialize the database and start the server.

### On AWS

1. Run the AWS migration script:
   ```
   ./aws-migration.sh
   ```

   This script will guide you through setting up AWS credentials and GitLab access token, and then use Terraform to deploy the infrastructure.

2. Ensure you have AWS credentials set up in .env file.

3. Choose to plan and apply changes when prompted.

### On Docker

To run the entire application stack using Docker locally:

1. Ensure Docker and Docker Compose are installed.

2. Run the following command:
   ```
   docker-compose up --build
   ```

   This will start the application, database, and all required services.

## Running Tests

To run the test suite:
```
npm run test
```

## API Documentation

API documentation is available in the [swagger.yaml](./swagger.yaml) file. You can view this in a [Swagger UI](https://editor.swagger.io/) or import it there. -or copy paste it into swagger ui- 

## Sample Credentials

It was super tricky to provide sample credentials and manage login without a client/frontend because we are using Google OAuth. To make it easier for grading we bypassed the authentication and make our endpoints public. However, we will demonstrate how to use the API with real credentials in the assessment demo.

## Environment Variables

The following environment variables can be configured in your `.env` file:

- `GOOGLE_CLIENT_ID`: Google OAuth client ID -in case it doesn't exist
- `JWT_SECRET`: Secret for JWT token generation -this will be generated automatically when `build.sh` is run-

For AWS deployment:
- `AWS_ACCESS_KEY_ID`: AWS access key -migration script will guide you through setting this up-
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key -migration script will guide you through setting this up-
- `AWS_SESSION_TOKEN`: AWS session token -migration script will guide you through setting this up-
- `GITLAB_ACCESS_TOKEN`: GitLab personal access token for repository access profile -> Settings -> Access Tokens -> Generate new token-
