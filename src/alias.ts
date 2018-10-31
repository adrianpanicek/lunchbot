'use strict';

import { DynamoDB } from 'aws-sdk';
import * as util from 'util';
import * as crypto from 'crypto';

const dynamo = new DynamoDB.DocumentClient();
const TableName = 'dev-aliases';

export async function get(event, context) {
    let result = await dynamo.get({
        TableName,
        Key: {aliasID: event.queryStringParameters.aliasName}
    }).promise();

    if(!result.Item) {
        return {
            statusCode: 404
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            aliases: [
                result.Item
            ]
        }),
    };    
};

export async function addAccessToken(event, context) {
    const tokenLength = 128; // TODO: extract to config
    const token = ((len) => {
        return crypto
            .randomBytes(Math.ceil(len / 2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, len) // return required number of characters
    })(tokenLength);

    await dynamo.update({
        TableName,
        Key: {aliasID: event.pathParameters.id},
        UpdateExpression: 'ADD aliasAccessTokens :c',
        ExpressionAttributeValues: {':c': dynamo.createSet([token])}
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            accessToken: token
        }),
    };
}