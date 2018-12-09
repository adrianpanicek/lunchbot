import { DynamoDB } from 'aws-sdk';
import {responseFailed, responseSuccess} from "../util";
import {BaseUser} from "../user/model";

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_STASHES: TableName} = process.env;

export async function handle(event) {
    const user: BaseUser = {
        identificator: event.requestContext.authorizer.principalId
    };
    if (!user.identificator) {
        console.error("User not defined");
        return responseFailed("User not defined");
    }

    try {
        let {Item: stash} = await getStash(user);
        return responseSuccess({stash});
    } catch(e) {
        console.error(e);
        return responseFailed(e);
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