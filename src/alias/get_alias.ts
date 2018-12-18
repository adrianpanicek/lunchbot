import { DynamoDB } from 'aws-sdk';
import {NotFound, responseSuccess} from "../application";
import {run} from "../index";

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_ALIASES} = process.env;

export async function action({pathParameters: {aliasID}}) {
        let {Item: alias} = await dynamo.get({
        TableName: TABLE_ALIASES,
        Key: {aliasID}
    }).promise();

    if(!alias) {
        throw new NotFound('Alias not found');
    }

    return responseSuccess(alias);
};

export const handle = run(action);