# Cinema Management Application

## Project Overview

This project is a cinema management application designed to handle various tasks such as managing films, reservations, theaters (salles), screenings (séances), and available seats. It also includes user authentication for both customers and administrators. Customers can create their accounts, view available films, and book seats for screenings. Administrators manage the system, including creating films, scheduling screenings, managing reservations, and adding other administrators.

## Technologies Used

- **Backend**: Node.js with Express.js for creating a RESTful API.
- **Authentication**: JWT (JSON Web Token) for secure user authentication.
- **Error Handling**: Detailed error responses during CRUD operations.

### Database

- **MongoDB**: To store user, film, screening, reservation, and theater data.
- **Mongoose**: For data modeling and managing relationships between films, screenings, and theaters.

## API Endpoints

### User Management

- **POST /api/auth/register**: Register a new customer.
- **POST /api/auth/login**: Login a user (customer or administrator).
- **POST /api/auth/logout**: Logout a user.
- **POST /api/admin/create**: Create a new administrator (admin only).
- **POST /api/auth/forget**: Send an email to reset the password.
- **POST /api/auth/reset**: Change the password via a token.
- **GET /api/users/me**: Returns the user's information.

### Entity Management

- **GET /api/entities**: Retrieve the list of entities.
- **POST /api/entities**: Add a new entity.
- **PUT /api/entities/:id**: Modify an entity.
- **DELETE /api/entities/:id**: Delete an entity.

## Security and Access Management

- Authentication via JWT.
- Protection of sensitive routes.

## Unit Tests

- Authentication
- Film Management
- Screening Management
- Reservation Management

## Libraries

- **Bcryptjs**
- **Dotenv**
- **Express**
- **Jsonwebtoken**
- **Mongoose**
- **Nodemailer**
- **Nodemon**
- **Jest or Mocha**


## Documentation

For more details, refer to the API documentation: [Postman Documentation](https://documenter.getpostman.com/view/33038212/2sAXqy3ehY#6558104f-ddd6-4303-b5ff-6719720c923e).
