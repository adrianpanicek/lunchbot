'use strict';
import {randomString} from "../util";
import {responseSuccess, Denied, NotFound} from "../application";
import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import {AuthUser, RefreshToken} from "./model";
import {sign} from "./token";
import {run} from "../index";

const db = new DynamoDB.DocumentClient();
const refreshTokenLength = 32;
const {TABLE_USERS, TABLE_REFRESH_TOKENS} = process.env;

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

export const action = async ({body: {email, password}}) => {
    const user: AuthUser = await getUserFromIdentificator(email);

    if (!user) {
        throw new NotFound("User was not found");
    }

    if (user.password !== await bcrypt.hash(password, user.salt)) {
        throw new Denied("Bad access credentials");
    }

    const {token: refreshToken} = await registerRefreshToken(randomString(refreshTokenLength), user);

    return responseSuccess({
        refreshToken,
        token: sign(user)
    });
}

export const handle = run(action);