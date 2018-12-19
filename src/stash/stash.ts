import {BaseUser} from "../user/model";
import {randomString} from "../util";
import {DynamoDB} from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_STASHES: TableName} = process.env;

export async function update(user: BaseUser, previousVersionToken, data) {
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