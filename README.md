# API Documentation

## Overview
This project is a Library Management System backend built using Express.js. Below is the list of available API endpoints, categorized by the type of user who can access them.
## Database 
Leveraged using MongoDB for feature slike flexible schema, scalable, cost-effectiveness.
## Authentication
Implemented  Role-Based-Access-Control(RBAC) using JWT and bcrypt for safe storing of user sensitive credentials

## API Endpoints

| Accessed By       | Endpoint                       | Description                                             | Parameters/Request Body                   | Returns                                  |
|-------------------|-------------------------------|---------------------------------------------------------|------------------------------------------|------------------------------------------|
| **Public**        | `POST /api/v1/auth/signup`    | Register user with validation and generate token        | `name`, `email`, `password`, `role`      | `token`, success message                |
| **Public**        | `POST /api/v1/auth/login`     | Login user and generate token                          | `email`, `password`                      | `token`, success message                |
| **Public**        | `GET /api/v1/public/books`    | Fetch all books with pagination                        | `page`, `limit`                          | List of books with pagination metadata   |
| **Public**        | `GET /api/v1/public/books/search` | Search books by title or genre                         | `query`, `page`, `limit`                 | List of matching books with metadata     |
| **Registered**    | `PUT /api/v1/users/update`    | Update user details                                    | `name`, `password`                       | Updated user details                     |
| **Registered**    | `DELETE /api/v1/users/delete` | Delete user account                                    | None                                     | Success message, user count before/after |
| **Registered**    | `GET /api/v1/users/profile`   | Get user profile                                       | None                                     | User details                             |
| **Registered**    | `POST /api/v1/users/logout`   | Logout user                                            | None                                     | Success message                          |
| **Reader**        | `POST /api/v1/reader/books/borrow` | Borrow a book                                           | `bookId`                                 | Success message, updated borrowed list   |
| **Reader**        | `POST /api/v1/reader/books/return` | Return a book                                           | `bookId`                                 | Success message, updated borrowed list   |
| **Author**        | `POST /api/v1/author/books/create` | Create a book                                           | `title`, `genre`, `stock`                | Created book details                     |
| **Author**        | `GET /api/v1/author/books`    | Fetch all books written by the author                 | None                                     | List of books with borrow status         |
| **Author**        | `DELETE /api/v1/author/books/delete` | Delete a book                                           | `bookId`                                 | Success message                          |
| **Author**        | `PUT /api/v1/author/books/update` | Update book details                                     | `bookId`, `title`, `genre`, `stock`      | Updated book details                     |
| **Author**        | `PUT /api/v1/author/books/modifyStock` | Modify stock quantity of a book                        | `bookId`, `stock`                        | Updated book details                     |
| **Author**        | `GET /api/v1/author/books/getBookInfo` | Fetch specific book info                               | `bookId`                                 | Book details                             |


## Notes
- **Public Access**: Endpoints that can be accessed without authentication.
- **Registered Users**: Endpoints available to users after registering.
- **Readers**: Endpoints exclusively available to readers.
- **Authors**: Endpoints exclusively available to authors.
# For Scalability
## Pagination
- For endpoints supporting pagination (`/api/v1/public/books` and `/api/v1/public/books/search`), use the query parameters:
  - `page` (default: 1): Specifies the page number.
  - `limit` (default: 10): Specifies the number of items per page.
## Search the entire books collection by title and genre
