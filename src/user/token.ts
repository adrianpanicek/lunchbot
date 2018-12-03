import * as jwt from "jsonwebtoken";
import {filterForToken, UserToken} from "./model";
import {SignOptions, VerifyOptions} from "jsonwebtoken";

const {TOKEN_SECRET, TOKEN_EXPIRATION} = process.env;

const signOptions: SignOptions = {
    expiresIn: TOKEN_EXPIRATION
};
const verifyOptions: VerifyOptions = {
    clockTolerance: 30 * 60
};

export const sign = (token: UserToken): string => jwt.sign(filterForToken(token), TOKEN_SECRET, signOptions);
export const verify = (token: string, options = {}): UserToken => jwt.verify(token, TOKEN_SECRET, {...verifyOptions, ...options}) as UserToken;
export const verifyNoExpiration = (token: string) => verify(token, {ignoreExpiration: true});