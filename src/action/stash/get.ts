import {run} from '@app/index';
import {responseSuccess} from "@app/application";
import {UserStashFactory} from "@app/model/UserStash/UserStashFactory";
import {getRepository} from "@app/model/Repository";
import {UserStashRepository} from "@app/model/UserStash/UserStashRepository";

export async function action({user}) {
    const factory = new UserStashFactory();
    const repository = await getRepository<UserStashRepository>(UserStashRepository);
    const model = factory.createFromObject({user});

    const stash = await repository.getLatest(model)
    stash.serializeData();

    return responseSuccess(stash);
}

export const handle = run(action);