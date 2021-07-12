const express = require('express');
const { User } = require('../models');
const { Course } = require('../models');

// Initializing a Router instance
const router = express.Router();

/*******************
 * 
 *  USER Routes 
 * 
 *******************/

// Get all users
router.get('/users', async (req, res) => {
  const users = await User.findAll();
  res
    .status(200)
    .json(users);
});

// Create a new user
router.post('/users', async (req, res) => {
  const errors = [];    // Defining Array where errors will be stored
  
  // Validating firstName, lastName, emailAddress and password with ternary operators
  !req.body.firstName ? errors.push('Please provide a value for "firstName"') : null;
  !req.body.lastName ? errors.push('Please provide a value for "lastName"') : null;
  !req.body.emailAddress ? errors.push('Please provide a value for "e-mail address"') : null;
  !req.body.password ? errors.push('Please provide a value for "password"') : null;
  
  if (errors.length > 0) {
    res
      .status(400)
      .json({ errors });
  } else {
    await User.create(req.body);
    res
      .location('/')
      .status(201)
      .end();
  }
});

/*******************
 * 
 *  COURSE Routes 
 * 
 *******************/

/*** Get all courses ***/
router.get('/courses', async (req, res) => {
  const courses = await Course.findAll();
  res
    .status(200)
    .json(courses);
});

/*** Get course by ID ***/
router.get('/courses/:id', async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  res
    .status(200)
    .json(course);
});

/*** Create a new course ***/
router.post('/courses', async (req, res) => {
  const errors = [];    // Defining Array where errors will be stored

  // Validating title and description with ternary operators
  !req.body.title ? errors.push('Please provide a value for "title"') : null;
  !req.body.description ? errors.push('Please provide a value for "description"') : null;

  if (errors.length > 0) {
    res
      .status(400)
      .json({ errors });
  } else {
    const course = await Course.build(req.body);
    await course.save();
    res
      .location('/courses/' + course.id)
      .status(201)
      .end();
  }
});

/*** Update course with an ID ":id" ***/
router.put('/courses/:id', async (req, res) => {
  const errors = [];    // Defining Array where errors will be stored

  // Validating title and description with ternary operators
  !req.body.title ? errors.push('Please provide a value for "title"') : null;
  !req.body.description ? errors.push('Please provide a value for "description"') : null;

  if (errors.length > 0) {
    res
      .status(400)
      .json({ errors });
  } else {
    const course = await Course.findByPk(req.params.id);
    await course.update(req.body);
    res
      .status(204)
      .end();
  }
});

/*** Delete course with an ID ":id" ***/
router.delete('/courses/:id', async (req, res) => {
  try{
    const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res
      .status(204)
      .end();
  } catch (error) {

  }
});

module.exports = router;