import { DynamoDB } from 'aws-sdk';
import {randomString} from "../util";
import {BaseUser, UserToken} from "../user/model";
import {BadRequest, Failed, responseSuccess} from "../application";
import {run} from "../index";

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_STASHES: TableName} = process.env;

export async function action({body: {previousVersionToken, data}, user: identificator}) {
    const user: UserToken = {
        identificator
    };
    if (!user.identificator) {
        console.error("Unknown user");
        throw new BadRequest("Unknown user");
    }

    try {
        let {Attributes: stash} = await updateStash(user, previousVersionToken, data);
        return responseSuccess({stash});
    } catch(e) {
        console.error(e);
        throw new Failed(e);
    }
}

export async function updateStash(user: BaseUser, previousVersionToken, data) {
    return await dynamo.update({
        TableName,
        Key: {
            userID: user.identificator
        },
        UpdateExpression: 'SET #stash_data = :d, #stash_token = :t',
        ExpressionAttributeNames: {'#stash_data': 'data', '#stash_token': 'versionToken'},
        ExpressionAttributeValues: {':d': data, ':t': randomString(32), ':pt': previousVersionToken},
        ConditionExpression: 'attribute_not_exists(#stash_token) OR #stash_token = :pt',
        ReturnValues: "ALL_NEW"
    }).promise();
}

export const handle = run(action);