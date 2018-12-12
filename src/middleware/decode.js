export const decode = async (req, next) => {
    if (req.body) {
        req.body = JSON.decode(req.body);
    }
    
    return await next({...req});
};