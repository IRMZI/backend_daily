// This file contains utility functions that can be used throughout the application for common tasks.

const formatResponse = (data, message = 'Success', status = 200) => {
    return {
        status,
        message,
        data,
    };
};

const handleError = (error, status = 500) => {
    return {
        status,
        message: error.message || 'Internal Server Error',
    };
};

module.exports = {
    formatResponse,
    handleError,
};