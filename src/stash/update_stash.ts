import {Denied, Failed, responseSuccess} from "../application";
import {run} from "../index";
import {Stash} from "../model/userStash";

export async function action({body: {previousVersionToken, data}, user}) {
    try {
        let stash = await Stash.update(user, previousVersionToken, data);
        return responseSuccess(stash);
    } catch(e) {
        console.error(e);
        switch(e.code) {
            case 403:
                throw new Denied(e.message);
            default:
                throw new Failed('Stash was not updated. Unknown error occured');
        }

    }
}

export const handle = run(action);