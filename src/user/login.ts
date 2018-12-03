'use strict';
import {randomString, response, responseSuccess} from "../util";
import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import {AuthUser, RefreshToken, filterForToken} from "./model";
import {sign} from "./token";

const db = new DynamoDB.DocumentClient();
const refreshTokenLength = 32;
const {TABLE_USERS, TABLE_REFRESH_TOKENS, TOKEN_SECRET, TOKEN_EXPIRATION} = process.env;

console.log("Enviroment variables parsed");

export async function getUserFromIdentificator(identificator: string): Promise<AuthUser> {
    console.log('Fetching database for user ' + identificator);

    const {Item: user} = await db.get({
        TableName: TABLE_USERS,
        Key: {identificator},
        ConsistentRead: false
    }).promise();

    return user as AuthUser;
}

async function registerRefreshToken(token: string, {identificator}: AuthUser): Promise<RefreshToken> {
    console.log('Registering new refresh token for ' + identificator);

    const Item = {
        token,
        user_id: identificator
    } as RefreshToken;

    await db.put({
        TableName: TABLE_REFRESH_TOKENS,
        Item,
        ReturnValues: "ALL_OLD"
    }).promise();

    console.log(JSON.stringify(Item))

    return Item;
}

export async function handle(event) {
    const {email, password} = JSON.parse(event.body)

    const user: AuthUser = await getUserFromIdentificator(email);

    if (!user) {
        return response({
            code: 404,
            message: "User not found"
        }, 404);
    }

    if (user.password !== await bcrypt.hash(password, user.salt)) {
        return response({
            code: 403,
            message: "Bad credentials"
        }, 403);
    }

    const {token: refreshToken} = await registerRefreshToken(randomString(refreshTokenLength), user);

    return responseSuccess({
        refreshToken,
        token: sign(user)
    });
}