import {update} from "../stash/stash";
import {BaseUser} from "../user/model";
import {BadRequest} from "../application";

export const updateStash = async (req, next) => {
    const response = await next(req);

    if(!response.originalRequest || !response.originalRequest.body.stash) {
        return response;
    }

    const {previousVersionToken, data} = response.originalRequest.body.stash;
    const user: BaseUser = {
        identificator: response.originalRequest.user
    }

    try {
        response.stash = await update(user, previousVersionToken, data);
    } catch (e) {
        if (e.code === 'ConditionalCheckFailedException') {
            throw new BadRequest(`Previous token doesn't match`);
        }
    }

    return {...response};
};