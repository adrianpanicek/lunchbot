export const jsonify = async (req, next) => {
    const result = await next({...req});
    
    return JSON.stringify(result);
};