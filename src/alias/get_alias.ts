import { DynamoDB } from 'aws-sdk';
import {responseNotFound, responseSuccess} from "../util";

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_ALIASES} = process.env;

export async function handle(event) {
    const {aliasID} = event.pathParameters;

    let {Item: alias} = await dynamo.get({
        TableName: TABLE_ALIASES,
        Key: {aliasID}
    }).promise();

    if(!alias) {
        return responseNotFound();
    }

    return responseSuccess(alias);
};
