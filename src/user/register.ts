import {DynamoDB} from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import {AuthUser} from "./model";
import {run} from "../index";
import {Conflict, responseCreated} from "../application";

const db = new DynamoDB.DocumentClient();

const {TABLE_USERS} = process.env;

export async function action({body: {email, password}}) {
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
    } catch(e) {
        console.error(e);
        throw new Conflict("User with that email already exists");
    }

    return responseCreated(user);
}

export const handle = run(action);