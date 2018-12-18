import { DynamoDB } from 'aws-sdk';
import {BaseUser} from "../user/model";
import {run} from '..';
import {BadRequest, Failed, responseSuccess} from "../application";

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_STASHES: TableName} = process.env;

export async function action({user: identificator}) {
    const user: BaseUser = {
        identificator
    };
    if (!user.identificator) {
        console.error("Unknown user");
        throw new BadRequest("Unknown user");
    }

    try {
        let {Item: stash} = await getStash(user);
        return responseSuccess({stash});
    } catch(e) {
        console.error(e);
        throw new Failed(e);
    }
}

export async function getStash(user: BaseUser) {
    return await dynamo.get({
        TableName,
        Key: {
            userID: user.identificator
        }
    }).promise();
}

export const handle = run(action);