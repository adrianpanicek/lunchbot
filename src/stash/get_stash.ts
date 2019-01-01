import {run} from '../index';
import {responseSuccess} from "../application";
import {UserStashFactory} from "../model/UserStash/UserStashFactory";
import {getRepository} from "../model/Repository";
import {UserStashRepository} from "../model/UserStash/UserStashRepository";

export async function action({user}) {
    const factory = new UserStashFactory();
    const repository = await getRepository<UserStashRepository>(UserStashRepository);
    const model = factory.createFromObject({user});

    const stash = await repository.getLatest(model)
    stash.serializeData();

    return responseSuccess(stash);
}

export const handle = run(action);