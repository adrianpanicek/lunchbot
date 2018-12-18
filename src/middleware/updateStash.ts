import {responseFailed, response} from "../application";
import {updateStash as model} from "../stash/update_stash";
import {BaseUser} from "../user/model";

export const updateStash = async (req, next) => {
    const response = await next(req);

    if(!req.originalRequest || !req.originalRequest.stash) {
        return response;
    }

    const {previousVersionToken, data} = req.originalRequest.stash;

    const user: BaseUser = {
        identificator: req.originalRequest.user
    }

    response.stash = await model(user, previousVersionToken, data);

    return {...response};
};