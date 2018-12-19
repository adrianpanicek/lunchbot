import {UserToken} from "../user/model";
import {BadRequest, Failed, responseSuccess} from "../application";
import {run} from "../index";
import {update} from "./stash";


export async function action({body: {previousVersionToken, data}, user: identificator}) {
    const user: UserToken = {
        identificator
    };
    if (!user.identificator) {
        console.error("Unknown user");
        throw new BadRequest("Unknown user");
    }

    try {
        let {Attributes: stash} = await update(user, previousVersionToken, data);
        return responseSuccess({stash});
    } catch(e) {
        console.error(e);
        throw new Failed(e);
    }
}

export const handle = run(action);