class CustomError extends Error{
  constructor(message , statuscode){
    super(message);
    this.statuscode = statuscode;
    this.status=statuscode >=400 && statuscode< 500 ? 'fail' : 'error';
    this.isOperationl = true;
    Error.captureStackTrace(this ,this.constructor)
  }
}

export default CustomError;