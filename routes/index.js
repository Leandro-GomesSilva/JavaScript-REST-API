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

/***  Get all users   ***/

// Retrieving all users and responding with status 200 and 'users' as json
router.get('/users', userBasicAuthentication, asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res
    .status(200)
    .json(users);
}));

/***  Create a new user  ***/

router.post('/users', asyncHandler(async (req, res) => {
  
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
}));

/*******************
 * 
 *  COURSE Routes 
 * 
 *******************/

/***  Get all courses   ***/

router.get('/courses', asyncHandler(async (req, res) => {
  
  // Retrieving all courses and responding with status 200 and 'courses' as json
  const courses = await Course.findAll();
  res
    .status(200)
    .json(courses);
}));

/***  Get course by ID  ***/

router.get('/courses/:id', asyncHandler(async (req, res) => {
  
  // Finding course and responding with status 200 and 'course' as json
  const course = await Course.findByPk(req.params.id);
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

  // Validating title and description with the custom middleware - errors are stored in the errors array
  const errors = serverSideValidation(req, res, 2, "title", "description");

  if (errors.length > 0) {
    // Returning status 400 and error messages in case any error
    res
      .status(400)
      .json({ errors });
  } else {
    // Updating course and returning status 204
    const course = await Course.findByPk(req.params.id);
    await course.update(req.body);
    res
      .status(204)
      .end();
  }
}));

/***  Delete course with ID ":id"  ***/

router.delete('/courses/:id', userBasicAuthentication, asyncHandler(async (req, res) => {
  
  // Deleting course and returning status 204
  const course = await Course.findByPk(req.params.id);
  await course.destroy();
  res
    .status(204)
    .end();
}));

module.exports = router;