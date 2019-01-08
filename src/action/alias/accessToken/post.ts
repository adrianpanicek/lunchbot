import {Denied, responseCreated} from "@app/application";
import {run} from "@app/index";
import {AliasAccessTokenFactory} from "@app/model/AliasAccessToken/AliasAccessTokenFactory";
import {AliasRepository} from "@app/model/Alias/AliasRepository";
import {getRepository} from "@app/model/Repository";
import {AliasFactory} from "@app/model/Alias/AliasFactory";
import {AliasAccessTokenRepository} from "@app/model/AliasAccessToken/AliasAccessTokenRepository";

export async function action({pathParameters: {alias}, user}) {
    const aliasFactory = new AliasFactory();
    const aliasRepository: AliasRepository = await getRepository(AliasRepository);

    try {
        const aliasDb = await aliasRepository.get(aliasFactory.createFromObject({id: alias}));
        if (aliasDb.user !== user) {
            console.log('Not matching users', aliasDb.user, user);
            throw 'Current user is not owner of alias';
        }
    } catch(e) {
        console.error(e);
        throw new Denied('Only owner of alias can create alias access token');
    }

    const repository = await getRepository(AliasAccessTokenRepository);
    const factory = new AliasAccessTokenFactory();
    const model = factory.createFromObject({alias});
    const savedAlias = await repository.update(model);

    return responseCreated({accessToken: savedAlias.accessToken});
}

export const handle = run(action);