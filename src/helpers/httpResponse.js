export const ok = (body) => {
    return {
            sucess: true,
            statusCode: 200,
            body
        }
}

export const notFound = () => {
    return {
        sucess: true,
        statusCode: 400,
        body: 'not found'
    }
}

export const serverError = (error) => {
    return {
        sucess: true,
        statusCode: 400,
        body: error
    }
}