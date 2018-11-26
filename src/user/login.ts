'use strict';
import * as jwt from 'jsonwebtoken';
import {randomString, response, responseSuccess} from "../util";
import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import {AuthUser, RefreshToken} from "./model";

const db = new DynamoDB.DocumentClient();
const refreshTokenLength = 32;
const {TABLE_USERS, TABLE_REFRESH_TOKENS, TOKEN_SECRET, TOKEN_EXPIRATION} = process.env;

console.log("Enviroment variables parsed");

async function getUserFromEmail(email: string): Promise<AuthUser> {
    console.log('Fetching database for user ' + email);

    const {Item: user} = await db.get({
        TableName: TABLE_USERS,
        Key: {email},
        ConsistentRead: false
    }).promise();

    return user as AuthUser;
}

async function registerRefreshToken(token: string, user: AuthUser): Promise<RefreshToken> {
    const {email} = user;
    console.log('Registering new refresh token for ' + email);

    const {Attributes: savedToken} = await db.put({
        TableName: TABLE_REFRESH_TOKENS,
        Item: {
            token,
            email
        },
        ReturnValues: "ALL_OLD"
    }).promise();

    console.log(JSON.stringify(savedToken))

    return savedToken as RefreshToken;
}

async function getRefreshToken(token: string): Promise<RefreshToken> {
    const {Item: dbToken} = await db.get({
        TableName: TABLE_REFRESH_TOKENS,
        Key: {token}
    }).promise();

    return dbToken as RefreshToken;
}

export async function credentials(event) {
    const {email, password} = JSON.parse(event.body)

    const user: AuthUser = await getUserFromEmail(email);

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
        token: jwt.sign({email}, TOKEN_SECRET, {
            expiresIn: TOKEN_EXPIRATION
        })
    });
}

export async function withRefreshToken(event, context) {
    const {refreshToken} = JSON.parse(event.body);

    const savedToken: RefreshToken = await getRefreshToken(refreshToken);
    if (!savedToken) {
        return response({
            code: 403,
            message: "Bad credentials"
        }, 403);
    }

    const {email} = refreshToken;

    return responseSuccess({
        token: jwt.sign({email}, TOKEN_SECRET, {
            expiresIn: TOKEN_EXPIRATION
        })
    });
}