import {response, responseCreated} from "../util";
import {DynamoDB} from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import {AuthUser} from "./model";

const db = new DynamoDB.DocumentClient();

const {TABLE_USERS} = process.env;

export async function register(event) {
    const {email, password} = JSON.parse(event.body);

    const salt = await bcrypt.genSalt();

    const user: AuthUser = {
        identificator: email,
        salt,
        password: await bcrypt.hash(password, salt),
        refreshTokens: []
    };

    try {
        await db.put({
            TableName: TABLE_USERS,
            Item: user,
            ConditionExpression: "attribute_not_exists(email)",
            ReturnValues: "ALL_OLD"
        }).promise();
    } catch(err) {
        console.log(JSON.stringify(err));
        return response({
            code: 409,
            message: "User with that email already exists"
        }, 409);
    }

    return responseCreated({});
}