import {responseFailed, response} from "../application";

export const catchErrors = async (req, next) => {
    try {
        return await next(req);
    } catch (e) {
        console.log('Response error', e);

        if (typeof e !== 'object' || !e.code) {
            console.error('Unknown error', e);

            return responseFailed('Unknown error');
        }

        const error = {
            code: e.code,
            message: e.message
        };

        return response(error, {code: e.code});
    }
};