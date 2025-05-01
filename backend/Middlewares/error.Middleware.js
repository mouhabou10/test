const errorMiddleware = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    console.error(err); // log original error
  
    // Handle CastError (e.g., invalid MongoDB ObjectId)
    if (err.name === 'CastError') {
      const message = 'Resource not found';
      error = new Error(message);
      error.statusCode = 404;
    }
  
    // Handle Duplicate Key Error (code 11000)
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new Error(message);
      error.statusCode = 400;
    }
  
    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = new Error(message);
      error.statusCode = 400;
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
  
  export default errorMiddleware;
  