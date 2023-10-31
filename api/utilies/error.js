export const error = (statuscode, message) => {
    const error = new Error();
    error.statusCode = statuscode;
    error.message = message;
    return error;
}