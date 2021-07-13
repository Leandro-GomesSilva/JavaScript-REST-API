// This function performs Server Side Validation and helps to keep the code on "routes/index.js" more concise.

function serverSideValidation(req, res, numberOfFields, field1, field2, field3, field4) {

  const errors = [];    // Defining the array where errors will be stored

  const fields = [field1, field2, field3, field4];    // Saving the passed fields into an array

  for (let i = 0; i < numberOfFields; i++)  {   // Iterating through the array of fields according the number of fields that were passed

    // For each fields, it checks if the fields is "falsy" - in case yes, it pushes an customized error to the errors array 
    !req.body[ fields[i] ] ? errors.push(`Please provide a value for "${fields[i]}"`) : null;
  }

  return errors;    // Returning the array of errors
}

module.exports = {serverSideValidation};