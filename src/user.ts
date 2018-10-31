import * as jwt from 'jsonwebtoken';
import {AuthResponse, CustomAuthorizerEvent, PolicyDocument} from "aws-lambda";
import { DynamoDB } from 'aws-sdk';
import * as uuid from 'uuid/v4';

const db = new DynamoDB.DocumentClient();

export interface TokenPayload {
    username: string
}

const TableName = process.env.TABLE_USERS;

export async function login(event, context) {
    const payload : TokenPayload = {
      username: 'test'
    };

    return {
        statusCode: 200,
        body: JSON.stringify({
            token: jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRATION
            })
        })
    };
}

export async function register(event, context) {
    const user = {
        userID: uuid(),
        status: 0
    };

    await db.put({
        TableName,
        Item: user
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify(user)
    }
}

export async function authorize(event: CustomAuthorizerEvent, context, callback) {
    if (!event.authorizationToken) {
        throw new Error('Unauthorized');
    }

    const token = event.authorizationToken.replace(/^Bearer /, '');
    try {
        let result: TokenPayload = jwt.verify(token, process.env.TOKEN_SECRET, {
            clockTolerance: 30 * 60,
            ignoreNotBefore: true
        }) as TokenPayload;

        callback(null, generatePolicy(result.username, 'Allow', event.methodArn));
    } catch (e) {
        callback(JSON.stringify(e));
    }
}

function generatePolicy(principalId: string, effect: string, resource: any): AuthResponse {
    const authResponse: AuthResponse = {
        principalId,
        policyDocument: null
    };

    if (!effect || !resource) {
        return authResponse;
    }

    const policyDocument: PolicyDocument = {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
        }]
    };

    authResponse.policyDocument = policyDocument;

    return authResponse;
};