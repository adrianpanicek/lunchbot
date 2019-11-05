export const dejsonify = async (req, next) => {
    console.log("Decoding json body");

    if (req.body)
        req.body = JSON.parse(req.body);

    return await next(req);
};