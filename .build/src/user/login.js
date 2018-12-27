'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { randomString } from "../util";
import { responseSuccess, Denied, NotFound } from "../application";
import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import { sign } from "./token";
import { run } from "../index";
const db = new DynamoDB.DocumentClient();
const refreshTokenLength = 32;
const { TABLE_USERS, TABLE_REFRESH_TOKENS } = process.env;
export function getUserFromIdentificator(identificator) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Fetching database for user ' + identificator);
        const { Item: user } = yield db.get({
            TableName: TABLE_USERS,
            Key: { identificator },
            ConsistentRead: false
        }).promise();
        return user;
    });
}
function registerRefreshToken(token, { identificator }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Registering new refresh token for ' + identificator);
        const Item = {
            token,
            user_id: identificator
        };
        yield db.put({
            TableName: TABLE_REFRESH_TOKENS,
            Item,
            ReturnValues: "ALL_OLD"
        }).promise();
        console.log(JSON.stringify(Item));
        return Item;
    });
}
export const action = ({ body: { email, password } }) => __awaiter(this, void 0, void 0, function* () {
    const user = yield getUserFromIdentificator(email);
    if (!user) {
        throw new NotFound("User was not found");
    }
    if (user.password !== (yield bcrypt.hash(password, user.salt))) {
        throw new Denied("Bad access credentials");
    }
    const { token: refreshToken } = yield registerRefreshToken(randomString(refreshTokenLength), user);
    return responseSuccess({
        refreshToken,
        token: sign(user)
    });
});
export const handle = run(action);
//# sourceMappingURL=login.js.map