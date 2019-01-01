import {UserAccessToken} from "./UserAccessToken";
import {Factory} from "../Factory";
import * as jwt from "jsonwebtoken";
import {VerifyOptions} from "jsonwebtoken";

const {TOKEN_SECRET} = process.env;
const defaultVerifyOptions: VerifyOptions = {
    clockTolerance: 30 * 60
};

export class UserAccessTokenFactory implements Factory<UserAccessToken> {
    createFromObject(data: Partial<UserAccessToken>): UserAccessToken {
        return Object.assign(new UserAccessToken, data);
    }

    createFromString(token: string, options: VerifyOptions = {}): UserAccessToken {
        const userObject = jwt.verify(token, TOKEN_SECRET, {...defaultVerifyOptions, ...options}) as object;
        return this.createFromObject(userObject);
    }
}