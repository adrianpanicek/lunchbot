import {Denied, NotFound, responseSuccess} from "../application";
import {run} from "../index";
import {Alias} from '../model/alias';
import {AliasAccessToken} from "../model/aliasAccessToken";

export async function action({pathParameters: {aliasID}, params, user}) {
    const alias = await Alias.queryOne({id: {eq: aliasID}}).exec();

    if(!alias) {
        throw new NotFound('Alias not found');
    }

    if(alias.user === user) {
        return responseSuccess(alias);
    }

    if(!params.accessToken) {
        throw new Denied('Alias doesn\'t belong to you, please provide valid accessToken');
    }

    const token = await AliasAccessToken.queryOne({id: {eq: aliasID}, accessToken: {eq: params.accessToken}}).exec();
    if(!token) {
        throw new Denied('Access token not valid');
    }

    return responseSuccess(alias);
};

export const handle = run(action);