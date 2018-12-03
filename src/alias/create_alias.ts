import { DynamoDB } from 'aws-sdk';
import {response, responseCreated, responseNotFound, responseSuccess} from "../util";
import * as bcrypt from "bcryptjs";
import {AuthUser} from "../user/model";

const db = new DynamoDB.DocumentClient();
const {TABLE_ALIASES} = process.env;

export async function handle(event) {
    const alias = JSON.parse(event.body); // Todo: check body size before parsing

    const Item = { // Todo: Validate inputs
        ...alias
    };

    try {
        await db.put({
            TableName: TABLE_ALIASES,
            Item
        }).promise();
    } catch(err) {
        console.log(JSON.stringify(err));
        return response({
            code: 409,
            message: "This alias name already exists"
        }, 409);
    }

    return responseCreated({
        alias: Item
    });
};
