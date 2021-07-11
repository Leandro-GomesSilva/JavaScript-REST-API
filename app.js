'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

// Importing the instance of sequelize from "models/index"
const { sequelize } = require('./models');

// Importing routes
const routes = require('./routes');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Synchronizing the model and testing the connection to the database
(async () => {
  await sequelize.sync();
  
  try {
    await sequelize.authenticate();
    console.log('The connection to the database was successful.');    // Connection successful
  } catch (error) {
    console.error('Ops! An error occurred when connecting to the database: ', error);    // Connection unsuccessful
  }
})();

// create the Express app
const app = express();

// setting JSON as the format of incomming requests
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Calling the routes
app.use('/api', routes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
