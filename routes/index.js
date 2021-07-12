const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');

// Initializing a Router instance
const router = express.Router();

/*******************
 * 
 *  USER Routes 
 * 
 *******************/

/***  Get all users   ***/

// Retrieving all users and responding with status 200 and 'users' as json
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res
    .status(200)
    .json(users);
}));

/***  Create a new user  ***/

router.post('/users', asyncHandler(async (req, res) => {
  const errors = [];    // Defining Array where errors will be stored
  
  // Validating firstName, lastName, emailAddress and password with ternary operators
  !req.body.firstName ? errors.push('Please provide a value for "firstName"') : null;
  !req.body.lastName ? errors.push('Please provide a value for "lastName"') : null;
  !req.body.emailAddress ? errors.push('Please provide a value for "e-mail address"') : null;
  !req.body.password ? errors.push('Please provide a value for "password"') : null;
  
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

router.post('/courses', asyncHandler(async (req, res) => {
  const errors = [];    // Defining Array where errors will be stored

  // Validating title and description with ternary operators
  !req.body.title ? errors.push('Please provide a value for "title"') : null;
  !req.body.description ? errors.push('Please provide a value for "description"') : null;

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

router.put('/courses/:id', asyncHandler(async (req, res) => {
  const errors = [];    // Defining Array where errors will be stored

  // Validating title and description with ternary operators
  !req.body.title ? errors.push('Please provide a value for "title"') : null;
  !req.body.description ? errors.push('Please provide a value for "description"') : null;

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

router.delete('/courses/:id', asyncHandler(async (req, res) => {
  
  // Deleting course and returning status 204
  const course = await Course.findByPk(req.params.id);
  await course.destroy();
  res
    .status(204)
    .end();
}));

module.exports = router;