import { debug } from "../helpers/logger.js"; // Import logger

export const ok = (data) => {
  debug(`ok response with data: ${JSON.stringify(data)}`);
  return {
    success: true,
    statusCode: 200,
    body: data,
  };
};

export const notFound = () => {
  return {
    success: false,
    statusCode: 400,
    body: "400 - Not Found",
  };
};

export const serverError = (error) => {
  debug(`serverError response with error: ${error.message}`);
  return {
    success: false,
    statusCode: 500,
    body: { error: error.message },
  };
};