class ApiError extends Error {
    statusCode: number;
    message: string;
    success: boolean;
    stack?: string | undefined;
    errors: object;

    constructor(
      statusCode: number,
      message = "Something went wrong",
      errors = [],
      stack = ""
    ) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      this.success = false;
      this.errors = errors;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export { ApiError };