export const jsonify = async (req, next) => {
    const result = await next(req);

    if (result.body)
        result.body = JSON.stringify(result.body);

    return result;
};