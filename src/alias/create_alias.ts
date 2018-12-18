import { DynamoDB } from 'aws-sdk';
import {Conflict, responseCreated} from '../application';
import {run} from '../index';

const db = new DynamoDB.DocumentClient();
const {TABLE_ALIASES} = process.env;

export async function action({body: alias}) {
    const Item = { // Todo: Validate inputs
        ...alias
    };

    try {
        await db.put({
            TableName: TABLE_ALIASES,
            Item
        }).promise();
    } catch (e) {
        console.log(e);
        throw new Conflict('Alias with this ID already exists')
    }

    return responseCreated({
        alias: Item
    });
};

export const handle = run(action);