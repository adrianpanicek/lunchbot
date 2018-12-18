import {RefreshToken} from "./model";
import {DynamoDB} from "aws-sdk";
import {sign} from "./token";
import {getUserFromIdentificator} from "./login";
import {run} from "../index";
import {BadRequest, Denied, responseCreated} from "../application";

const db = new DynamoDB.DocumentClient();
const {TABLE_REFRESH_TOKENS} = process.env;

async function getRefreshToken(token: string): Promise<RefreshToken> {
    const {Item: dbToken} = await db.get({
        TableName: TABLE_REFRESH_TOKENS,
        Key: {token}
    }).promise();

    return dbToken as RefreshToken;
}

export async function action({body: {refreshToken}}) {
    if(!refreshToken) {
        throw new BadRequest('Refresh token parameter missing');
    }

    const token: RefreshToken = await getRefreshToken(refreshToken);
    if(!token) {
        throw new Denied(`Refresh token ${refreshToken} not found`);
    }

    const user = await getUserFromIdentificator(token.user_id);
    return responseCreated({
        token: sign(user)
    });
}

export const handle = run(action);