export const proxyFormat = async (req, next) => {
    const result = await next({...req});
    
    console.log(result);
    return {
        statusCode: 200, // TODO: Unhardcode
        body: result
    }
};