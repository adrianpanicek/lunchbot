import {BadRequest, Denied, Failed, responseCreated} from '@app/application';
import {run} from '@app/index';
import {getRepository} from "@app/model/Repository";
import {AliasRepository} from "@app/model/Alias/AliasRepository";
import {AliasFactory} from "@app/model/Alias/AliasFactory";
import {AliasNameRepository} from "@app/model/AliasName/AliasNameRepository";
import {AliasNameFactory} from "@app/model/AliasName/AliasNameFactory";

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

    try {
        const response = (await repository.update(aliasModel)).serialize();
        return responseCreated(response);
    } catch (e) {
        console.log(e);
        throw new Failed('Error in saving alias')
    }
};

export const handle = run(action);