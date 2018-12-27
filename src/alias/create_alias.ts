import {Conflict, responseCreated} from '../application';
import {run} from '../index';
import {Alias} from '../model/alias';

export async function action({body: {alias}, user}) {
    const aliasModel = new Alias({...alias, user});

    try {
        return responseCreated({
            alias: await aliasModel.save()
        })
    } catch (e) {
        console.log(e);
        throw new Conflict('Alias with this ID already exists')
    }
};

export const handle = run(action);