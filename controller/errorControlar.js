import customError from '../customError.js';

const deverror = (res, error) => {
  res.status(error.statusCode).json({  // Fixed: added . before json
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const proderror = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({  // Fixed: added . before json
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong",  // Fixed typo in "something"
    });
  }
};

const castErrorHandler = (err) => {
  const msg = `invalid value ${err.value} for field ${err.path}`;
  return new customError(msg, 400);
};

const duplicatekeyerror = (err) => {
  const name = err.keyValue.name;
  const msg = `there is already a movie with name ${name} use other name`;  // Fixed typo in "other"
  return new customError(msg, 404);
};

const validationErrorHandler = (err) => {
  const error = Object.values(err.errors).map(val => val.message);
  const errorMessage = error.join('. ');
  const mess = `invalid input data ${errorMessage}`;
  return new customError(mess, 400);
};

export default (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  
  if (process.env.NODE_ENV === "development") {
    deverror(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === 'CastError') {
      error = castErrorHandler(error);
    }
    if (error.code === 11000) {
      error = duplicatekeyerror(error);  // Fixed: added error parameter
    }
    if (error.name === 'ValidationError') {  // Fixed capitalization
      error = validationErrorHandler(error);
    }
    proderror(res, error);
  }
};