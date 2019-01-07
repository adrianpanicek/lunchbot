import {BadRequest, Denied, Failed, responseCreated} from '../application';
import {run} from '../index';
import {getRepository} from "../model/Repository";
import {AliasRepository} from "../model/Alias/AliasRepository";
import {AliasFactory} from "../model/Alias/AliasFactory";
import {AliasNameRepository} from "../model/AliasName/AliasNameRepository";
import {AliasNameFactory} from "../model/AliasName/AliasNameFactory";

export async function action({body: alias, user}) {
    const repository = await getRepository(AliasRepository);
    const factory = new AliasFactory();
    const aliasModel = factory.createFromObject({...alias, user}).deserialize();

    try {
        await aliasModel.validate();
        aliasModel.deserialize();
    } catch (e) {
        console.error(e);
        throw new BadRequest(e.message);
    }

    const nameRepository = await getRepository(AliasNameRepository);
    const nameFactory = new AliasNameFactory();

    try {
        await nameRepository.save(nameFactory.createFromAlias(aliasModel));
    } catch (e) {
        console.error(e);
        throw new Denied('Alias name already in use');
    }

    try {
        const response = (await repository.save(aliasModel)).serialize();
        return responseCreated(response);
    } catch (e) {
        console.log(e);
        throw new Failed('Error in saving alias')
    }
};

export const handle = run(action);