import {run} from '../index';
import {Failed, responseSuccess} from "../application";
import {Stash} from "../model/userStash";

export async function action({user}) {
    try {
        let stash = await Stash.getLatest(user);
        return responseSuccess(stash);
    } catch(e) {
        console.error(e);
        throw new Failed(e);
    }
}

export const handle = run(action);