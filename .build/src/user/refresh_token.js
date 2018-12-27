var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DynamoDB } from "aws-sdk";
import { sign } from "./token";
import { getUserFromIdentificator } from "./login";
import { run } from "../index";
import { BadRequest, Denied, responseCreated } from "../application";
const db = new DynamoDB.DocumentClient();
const { TABLE_REFRESH_TOKENS } = process.env;
function getRefreshToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Item: dbToken } = yield db.get({
            TableName: TABLE_REFRESH_TOKENS,
            Key: { token }
        }).promise();
        return dbToken;
    });
}
export function action({ body: { refreshToken } }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!refreshToken) {
            throw new BadRequest('Refresh token parameter missing');
        }
        const token = yield getRefreshToken(refreshToken);
        if (!token) {
            throw new Denied(`Refresh token ${refreshToken} not found`);
        }
        const user = yield getUserFromIdentificator(token.user_id);
        return responseCreated({
            token: sign(user)
        });
    });
}
export const handle = run(action);
//# sourceMappingURL=refresh_token.js.map