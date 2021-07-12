/*** 
 *  This module was copied from the module with same name from 
 *    the project "rest-api" of the Workshop "REST API Authentication 
 *    with Express" (Unit 9 of the Full Stack JavaScript Techdegree 
 *    from Treehouse)
 * 
 *  ***/

// Handler function to wrap each route.
exports.asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}