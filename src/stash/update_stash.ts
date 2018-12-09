import { DynamoDB } from 'aws-sdk';
import {responseFailed, responseSuccess, randomString} from "../util";
import {BaseUser, UserToken} from "../user/model";

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_STASHES: TableName} = process.env;

export async function handle(event) {
    const {previousVersionToken, data} = JSON.parse(event.body);
    const user: UserToken = {
        identificator: event.requestContext.authorizer.principalId
    };
    if (!user.identificator) {
        console.error("User not defined");
        return responseFailed("User not defined");
    }

    try {
        let {Attributes: stash} = await updateStash(user, previousVersionToken, data);
        return responseSuccess({stash});
    } catch(e) {
        console.error(e);
        return responseFailed(e);
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