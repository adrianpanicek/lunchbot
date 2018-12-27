import {Denied, responseCreated} from "../application";
import {run} from "../index";
import {AliasAccessToken} from "../model/aliasAccessToken";
import {Alias} from "../model/alias";
import {randomString} from "../util";

export async function action({pathParameters: {aliasID}, user}) {
    const alias = await Alias.queryOne({id: {eq: aliasID}}).exec();
    if(alias.user === user) {
        throw new Denied('Only owner of alias can create access token');
    }

    const newToken = new AliasAccessToken({
        id: aliasID,
        accessToken: randomString(32)
    });

    const accessToken = await newToken.save();

    return responseCreated({accessToken});
}

export const handle = run(action);