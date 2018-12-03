import { DynamoDB } from 'aws-sdk';
import {responseCreated, responseNotFound, responseSuccess} from "../util";
import * as crypto from 'crypto';

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_ALIASES: TableName} = process.env;

const generateRandomToken = (len) => {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len) // return required number of characters
};

export async function handle(event, context) {
    const {aliasID} = event.pathParameters;

    const tokenLength = 128; // TODO: extract to config
    const accessToken = generateRandomToken(tokenLength);

    await dynamo.update({
        TableName,
        Key: {aliasID},
        UpdateExpression: 'ADD aliasAccessTokens :c',
        ExpressionAttributeValues: {':c': dynamo.createSet([accessToken])}
    }).promise();

    return responseCreated({accessToken});
}