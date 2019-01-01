import {Denied, Failed, responseSuccess} from "../application";
import {run} from "../index";
import {UserStashFactory} from "../model/UserStash/UserStashFactory";
import {getRepository} from "../model/Repository";
import {UserStashRepository} from "../model/UserStash/UserStashRepository";

export async function action({body: {previousVersionToken, data}, user}) {
    const factory = new UserStashFactory();
    const repository = await getRepository<UserStashRepository>(UserStashRepository);
    const model = factory.createFromObject({
        user,
        previousVersionToken,
        data
    });

    try {
        model.deserializeData();
        const stash = await repository.updateStash(model);
        console.log(stash);
        stash.serializeData();
        return responseSuccess(stash);
    } catch(e) {
        console.error(e);
        switch(e.code) {
            case 'VersionMismatch':
                throw new Denied(e.message);
            default:
                throw new Failed('Stash was not updated. Unknown error occured');
        }
    }
}

export const handle = run(action);