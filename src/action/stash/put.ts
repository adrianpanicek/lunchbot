import {Denied, Failed, responseSuccess} from "@app/application";
import {run} from "@app/index";
import {UserStashFactory} from "@app/model/UserStash/UserStashFactory";
import {getRepository} from "@app/model/Repository";
import {UserStashRepository} from "@app/model/UserStash/UserStashRepository";

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
        const stash = await repository.update(model);
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