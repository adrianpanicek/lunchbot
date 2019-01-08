import {Denied, NotFound, responseSuccess} from "@app/application";
import {run} from "@app/index";
import {getRepository} from "@app/model/Repository";
import {AliasRepository} from "@app/model/Alias/AliasRepository";
import {AliasFactory} from "@app/model/Alias/AliasFactory";
import {Alias, AliasSecurityLevel} from "@app/model/Alias/Alias";
import {firewallFilter} from "@app/decorator/firewall";
import {AliasAccessTokenFactory} from "@app/model/AliasAccessToken/AliasAccessTokenFactory";
import {AliasAccessTokenRepository} from "@app/model/AliasAccessToken/AliasAccessTokenRepository";

export async function action({pathParameters: {alias: id}, params, user}) {
    const aliasRepository = await getRepository<AliasRepository>(AliasRepository);
    const aliasFactory = new AliasFactory();

    let alias: Alias;
    try {
        alias = await aliasRepository.get(aliasFactory.createFromObject({id}));
        alias.serialize();
    } catch (e) {
        console.error(e);
        console.error('Alias with following id not found', id);
        throw new NotFound('Alias not found');
    }

    if (alias.user === user) {
        return responseSuccess(firewallFilter(alias, AliasSecurityLevel.RESOURCE_OWNER));
    }

    if (params.accessToken) {
        const aliasAccessTokenFactory = new AliasAccessTokenFactory();
        const tokenRepository = await getRepository<AliasAccessTokenRepository>(AliasAccessTokenRepository);
        const tokenModel = aliasAccessTokenFactory.createFromObject({alias: alias.id, accessToken: params.accessToken});

        try {
            await tokenRepository.get(tokenModel);
        } catch (e) {
            console.error(e);
            throw new Denied('Provided accessToken is invalid');
        }

        return responseSuccess(firewallFilter(alias, AliasSecurityLevel.PROTECTED));
    }

    if (alias.private) {
        throw new Denied('This alias is not publicly accessible');
    }

    return responseSuccess(firewallFilter(alias, AliasSecurityLevel.PUBLIC));
};

export const handle = run(action);