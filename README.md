# JavaScript: REST API
 The 9th project on the Full Stack JavaScript Techdegree. This is REST API built with Express that provides a way to manage a school database, which contains information about users and courses.
 
  Main technologies: JavaScript, Node.js, Express.js<br>
  Auxiliary technologies: SQL, Sequelize ORM<br>
  Complexity level: Intermediate<br>
  Estimated Time to Complete: 32 hours<br>
  Concepts: REST API, Relational Database, Server-side Validation, Database Validation, Authentication, SQL ORM, SQL CRUD operations, AJAX, Routes, Middleware, HTTP requests, Request Object, Response Object, Server<br>

## For "Exceeds Requirements":
  - E-mail address validation and constraint (valid and unique)
  - Irrelevant attributes are filtered out of the response
  - Users POST route handles a Sequelize Constraint Error
  - PUT and DELETE routes ensures that authenticated user is indeed the course's owner

## Extras:
  - Modularization of the server-side validation via the "server-side-validation" Middleware

## Instructions:
  - Download or clone the repository
  - Run "npm install" to install all dependencies
  - Run "npm run seed" to create the initial database and seed it with initial data
  - The file "RESTAPI.postman_collection.json" can be imported into Postman and used to test the application