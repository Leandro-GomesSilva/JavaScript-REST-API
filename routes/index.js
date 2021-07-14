const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { Course } = require('../models');

// Requiring Custom Middlewares
const { asyncHandler } = require('../middleware/async-handler');
const { userBasicAuthentication } = require('../middleware/basic-auth-user');
const { serverSideValidation } = require('../middleware/server-side-validation');

// Initializing a Router instance
const router = express.Router();

/*******************
 * 
 *  USER Routes 
 * 
 *******************/

/***  Get currently authenticated user   ***/

// Retrieving the currently authenticated user and responding with a status 200 ('Ok') and the user's properties and values as json
router.get('/users', userBasicAuthentication, asyncHandler(async (req, res) => {
  
  const currentUser = req.currentUser;    // Storing the authenticated user's object into a variable
  
  const users = await User.findByPk(currentUser.id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });    // Finding by user's Id and filtering out some attributes from the SQL query
  res
    .status(200)
    .json(users);
}));

/***  Create a new user  ***/

router.post('/users', asyncHandler(async (req, res) => {
  
  try {
    // Validating firstName, lastName, emailAddress and password with the custom middleware - errors are stored in the errors array
    const errors = serverSideValidation(req, res, 4, "firstName", "lastName", "emailAddress", "password");
    
    if (errors.length > 0) {
      // Returning status 400 and error messages in case any error
      res
        .status(400)
        .json({ errors });
    } else {
      // Hashing password before persisting user to the database
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      
      // Creating user in the database, setting location header and returning status 201
      await User.create(req.body);
      res
        .location('/')
        .status(201)
        .end();
    }
  } catch(error) {    // Checking and handling Sequelize Unique Constraint errors
      if (error.name === 'SequelizeUniqueConstraintError') {   
        const errors = error.errors.map(err => err.message);    // Extracting the error message of each error.errors array
        res.status(400).json({ errors });   // Returning status 400 (Bad Request) and the error messages
      } else {
        throw error;
    }
  }
}));

/*******************
 * 
 *  COURSE Routes 
 * 
 *******************/

/***  Get all courses   ***/

router.get('/courses', asyncHandler(async (req, res) => {
  
  // Retrieving all courses and responding with status 200 and 'courses' as json
  const courses = await Course.findAll({ 
    attributes: { exclude: ['createdAt', 'updatedAt'] },    // Filtering out some attributes from the SQL query
    include: { 
      model: User,    // Including the user associated with each course
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },    // Filtering out some attributes of the user as well
    },
  });
  res
    .status(200)
    .json(courses);
}));

/***  Get course by ID  ***/

router.get('/courses/:id', asyncHandler(async (req, res) => {
  
  // Finding course and responding with status 200 and 'course' as json
  const course = await Course.findByPk(req.params.id, { 
    attributes: { exclude: ['createdAt', 'updatedAt'] },    // Filtering out some attributes from the SQL query
    include: { 
      model: User,    // Including the user associated with each course
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },    // Filtering out some attributes of the user as well
    },
  });
  res
    .status(200)
    .json(course);
}));

/***  Create a new course   ***/

router.post('/courses', userBasicAuthentication, asyncHandler(async (req, res) => {

  // Validating title and description with the custom middleware - errors are stored in the errors array
  const errors = serverSideValidation(req, res, 2, "title", "description");

  if (errors.length > 0) {
    // Returning status 400 and error messages in case any error
    res
      .status(400)
      .json({ errors });
  } else {
    // Building course, saving it into the database, setting location header and returning status 201
    const course = await Course.build(req.body);
    await course.save();
    res
      .location('/courses/' + course.id)
      .status(201)
      .end();
  }
}));

/***  Update course with an ID ":id"  ***/

router.put('/courses/:id', userBasicAuthentication, asyncHandler(async (req, res) => {

  // Querying course object with 'id' parameter and storing it in a variable
  const course = await Course.findByPk(req.params.id);

  // Storing the user ID of the authenticated user into a variable
  const authenticatedId = req.currentUser.id;
  
  if (authenticatedId == course.userId) {   // Checking if authenticated user owns the course
    
    // Validating title and description with the custom middleware - errors are stored in the errors array
    const errors = serverSideValidation(req, res, 2, "title", "description");

    if (errors.length > 0) {
      // Returning status 400 and error messages in case any error
      res
        .status(400)
        .json({ errors });
    } else {
      
      await course.update(req.body);
      res
        .status(204)
        .end();
    }

  } else {    // In case authenticated user does not own the course...
    res   // ... returns status 403 ('Forbidden') and an error message
    .status(403)
    .json({ "message": "Forbidden - currently authenticated user does not own the course" });
  }
}));

/***  Delete course with ID ":id"  ***/

router.delete('/courses/:id', userBasicAuthentication, asyncHandler(async (req, res) => {
  
  // Querying course object with 'id' parameter and storing it in a variable
  const course = await Course.findByPk(req.params.id);

  // Storing the user ID of the authenticated user into a variable
  const authenticatedId = req.currentUser.id;
  
  if (authenticatedId == course.userId) {   // Checking if authenticated user owns the course
    await course.destroy();   // Deleting course
    res   // Returning status 204 and ending response
      .status(204)
      .end();

  } else {    // In case authenticated user does not own the course...
    res   // ... returns status 403 ('Forbidden') and an error message
    .status(403)
    .json({ "message": "Forbidden - currently authenticated user does not own the course" });
  }
}));

module.exports = router;