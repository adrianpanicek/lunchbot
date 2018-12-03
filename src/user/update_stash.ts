import { DynamoDB } from 'aws-sdk';
import {response, responseCreated, responseDenied, responseFailed, responseSuccess} from "../util";
import {UserToken} from "./model";

const dynamo = new DynamoDB.DocumentClient();
const {TABLE_USERS: TableName} = process.env;

export async function handle(event) {
    const {stash} = JSON.parse(event.body);
    const user: UserToken = {
        identificator: event.requestContext.authorizer.principalId
    };
    if (!user.identificator) {
        console.error("User not defined");
        return responseFailed("User not defined");
    }

    try {
        await dynamo.update({
            TableName,
            Key: user,
            UpdateExpression: 'SET stash = :c',
            ExpressionAttributeValues: {':c': stash}
        }).promise();
    } catch(e) {
        console.error(e);
        return responseFailed(e);
    }

    return responseSuccess({stash});
}