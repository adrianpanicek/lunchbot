export const jsonify = async (req, next) => {
    const result = await next(req);

    console.log("Encoding json body", result.body);

    if (result.body)
        result.body = JSON.stringify(result.body);

    delete result.originalRequest;

    return result;
};