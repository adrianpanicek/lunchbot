import {update} from "../stash/stash";
import {BaseUser} from "../user/model";
import {BadRequest} from "../application";

export const updateStash = async (req, next) => {
    if(!req.body || !req.body.stash) {
        return await next(req);
    }

    const {previousVersionToken, data} = req.body.stash;
    const user: BaseUser = {
        identificator: req.user
    }

    let stash = undefined;
    try {
        stash = await update(user, previousVersionToken, data);
    } catch (e) {
        if (e.code === 'ConditionalCheckFailedException') {
            throw new BadRequest(`Previous token doesn't match`);
        }
    }

    const result = await next(req);
    result.stash = stash;

    return result;
};