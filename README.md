# Homework Frontend

This is the frontend for the Helmes homework project. It is built using **Angular** and communicates with the backend via a REST API.

## Features
- **Reactive form** for handling user input
- **Basic authentication** for API calls
- **Bootstrap** for styling
- **Tests** using Karma and Jasmine

## Prerequisites
- Node.js
- Angular CLI

## Installation and running the project

### 1. Clone the repository
```sh
$ git clone <repository-url>
$ cd helmes-homework-frontend
```

### 2. Install dependencies
```sh
$ npm install
```

### 3. Start the development server
```sh
$ ng serve
```
The application will be available at `http://localhost:4200/`.

## API communication
The application interacts with a backend API using Basic authentication.
- API base URL: `http://localhost:8080`
- Endpoints:
  - `GET /api/sectors` - Retrieve sector options.
  - `POST /api/user-data` - Submit user data.
  - `PUT /api/user-data/{id}` - Update existing user data.

## Running tests
To execute tests:
```sh
$ ng test
```
This runs the tests using **Karma** and **Jasmine**.


## Technologies Used
- **Angular**
- **Bootstrap**
- **Karma & Jasmine** (for testing)
