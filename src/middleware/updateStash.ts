import {BadRequest} from "../application";
import {Stash} from "../model/userStash";

export const updateStash = async (req, next) => {
    if(!req.body || !req.body.stash) {
        return await next(req);
    }

    const {previousVersionToken, data} = req.body.stash;

    let stash = undefined;
    try {
        stash = await Stash.update(req.user, previousVersionToken, data);
    } catch (e) {
        if (e.code === 403) {
            throw new BadRequest(`Previous token doesn't match`);
        }
    }

    const result = await next(req);
    result.stash = stash;

    return result;
};