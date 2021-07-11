const express = require('express');
const { User } = require('../models');
const { Course } = require('../models');

// Initializing a Router instance
const router = express.Router();

/*******************
 * 
 *  User Routes 
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
  try{
    await User.create(req.body);
    res
      .location('/')
      .status(201)
      .end();
  } catch (error) {

  }
});

/*******************
 * 
 *  Course Routes 
 * 
 *******************/

// Get all courses
router.get('/courses', async (req, res) => {
  const courses = await Course.findAll();
  res
    .status(200)
    .json(courses);
});

// Get course by ID
router.get('/courses/:id', async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  res
    .status(200)
    .json(course);
});

// Create a new course
router.post('/courses', async (req, res) => {
  try{
    const course = await Course.build(req.body);
    await course.save();
    res
      .location('/courses/' + course.id)
      .status(201)
      .end();
  } catch (error) {

  }
});

// Update course with an ID ":id"
router.put('/courses/:id', async (req, res) => {
  try{
    const course = await Course.findByPk(req.params.id);
    await course.update(req.body);
    res
      .status(204)
      .end();
  } catch (error) {

  }
});

// Delete course with an ID ":id"
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