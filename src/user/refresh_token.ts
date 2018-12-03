import {RefreshToken} from "./model";
import {responseCreated, responseDenied} from "../util";
import {DynamoDB} from "aws-sdk";
import {sign} from "./token";
import {getUserFromIdentificator} from "./login";

const db = new DynamoDB.DocumentClient();
const {TABLE_REFRESH_TOKENS} = process.env;

async function getRefreshToken(token: string): Promise<RefreshToken> {
    const {Item: dbToken} = await db.get({
        TableName: TABLE_REFRESH_TOKENS,
        Key: {token}
    }).promise();

    return dbToken as RefreshToken;
}

export async function handle(event) {
    const {refreshToken} = JSON.parse(event.body);

    if(!refreshToken) {
        console.log('Refresh token parameter missing');
        return responseDenied();
    }

    const token: RefreshToken = await getRefreshToken(refreshToken);
    if(!token) {
        console.log('Refresh token ' + refreshToken + ' not found in database');
        return responseDenied();
    }

    const user = await getUserFromIdentificator(token.user_id);
    return responseCreated({
        token: sign(user)
    });
}