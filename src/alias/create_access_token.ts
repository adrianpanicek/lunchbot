import { DynamoDB } from 'aws-sdk';
import * as crypto from 'crypto';
import {responseCreated} from "../application";
import {run} from "../index";

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_ALIASES: TableName} = process.env;

const generateRandomToken = (len) => {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len) // return required number of characters
};

export async function action({pathParameters: {aliasID}}) {
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

export const handle = run(action);