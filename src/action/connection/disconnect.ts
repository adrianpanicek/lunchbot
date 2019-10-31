import {responseSuccess} from "@app/application";
import {run} from "@app/index";
import {getRepository} from "@app/model/Repository";
import {Connection} from "@app/model/Connection/Connection";
import {ConnectionRepository} from "@app/model/Connection/ConnectionRepository";

export const action = async ({context: {connectionId}}) => {
    const repository = await getRepository<ConnectionRepository>(ConnectionRepository);

    console.log('Removing disconnected socket ' + connectionId);
    const connection = new Connection();
    connection.id = connectionId;

    await repository.delete(connection);

    return responseSuccess({});
};

export const handle = run(action);