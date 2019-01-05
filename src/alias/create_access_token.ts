import {Denied, responseCreated} from "../application";
import {run} from "../index";
import {AliasAccessTokenFactory} from "../model/AliasAccessToken/AliasAccessTokenFactory";
import {AliasRepository} from "../model/Alias/AliasRepository";
import {getRepository} from "../model/Repository";
import {AliasFactory} from "../model/Alias/AliasFactory";
import {AliasAccessTokenRepository} from "../model/AliasAccessToken/AliasAccessTokenRepository";

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