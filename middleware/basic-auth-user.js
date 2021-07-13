const authorizationHeader = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.userBasicAuthentication = async (req, res, next) => {
  
  var message;    // Declaring the variable message outside the scope of the IF's below, so it can be accessed outside them

  const userCredentials = authorizationHeader(req);   // Reading the Authorization header and storing it in a variable
  
  if (userCredentials) {    // Checking if there is an Authorization Header in the Request
    const user = await User.findOne({ where: { emailAddress: userCredentials.name } });   // Retrieving an "user" accordingly the username passed on the Authorization Header
    
    if (user) {   // Checking if there is an user with the username passed on the Authorization Header
      const authenticated = bcrypt.compareSync(userCredentials.pass, user.password);    // Comparing the passwords in the Authorization Header and the one stored in the Database

      if (authenticated) {    // Checking if the two passwords (Auth. Header and Database) match
        console.log(`Authentication successful for username: ${user.emailAddress}`);    // Displaying a success message
        req.currentUser = user;   // Storing the user's information in the Request Object

      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;    // If the "if block" for the variable "authenticated" fails, display this message
      }
    } else {
      message = `User not found: ${userCredentials.name}`;   // If the "if block" for the variable "user" fails, display this message
    }
  } else {
    message = 'Authorization header not found';   // If the "if block" for the variable "userCredentials" fails, display this message
  }

  if (message) {    // Checking if there was an error 
    console.warn(message);    
    res.status(401).json({ message: 'Access Denied' });   // Respond with status 401 ("Unauthorized") and a generic and brief message in case there was an error
    
  } else {
    next();   // Proceeds to the next Middleware
  }
};