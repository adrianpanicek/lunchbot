import {Denied, Failed} from "../application";
import {UserStashFactory} from "../model/UserStash/UserStashFactory";
import {getRepository} from "../model/Repository";
import {UserStashRepository} from "../model/UserStash/UserStashRepository";

export const updateStash = async (req, next) => {
    if(!req.body || !req.body.stash) {
        return await next(req);
    }

    const {previousVersionToken, data} = req.body.stash;

    const repository = await getRepository<UserStashRepository>(UserStashRepository);
    const factory = new UserStashFactory();
    const model = factory.createFromObject({
        previousVersionToken,
        data,
        user: req.user
    });

    let stash = undefined;
    try {
        model.deserializeData();
        stash = await repository.update(model);
        stash.serializeData();
    } catch (e) {
        console.error(e);
        switch(e.code) {
            case 'VersionMismatch':
                throw new Denied(e.message);
            default:
                throw new Failed('Stash was not updated. Unknown error occured');
        }
    }

    try {
        const result = await next(req);

        if (!result.body) {
            console.error('No body in result, skipping appending of stash');
            return result;
        }

        result.body.stash = stash;
        return result;
    } catch (e) {
        console.log('Rollbacking stash to old version');
        await repository.rollback(stash);
        throw e;
    }
};