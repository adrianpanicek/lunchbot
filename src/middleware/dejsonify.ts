export const dejsonify = async (req, next) => {
    console.log("Decoding json body", req.body);

    try {
        if (req.body)
            req.body = JSON.parse(req.body);
    } catch (e) {
        console.log(e);
    }

    return await next(req);
};