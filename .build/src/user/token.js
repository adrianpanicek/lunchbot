import * as jwt from "jsonwebtoken";
import { filterForToken } from "./model";
const { TOKEN_SECRET, TOKEN_EXPIRATION } = process.env;
const signOptions = {
    expiresIn: TOKEN_EXPIRATION
};
const verifyOptions = {
    clockTolerance: 30 * 60
};
export const sign = (token) => jwt.sign(filterForToken(token), TOKEN_SECRET, signOptions);
export const verify = (token, options = {}) => jwt.verify(token, TOKEN_SECRET, Object.assign({}, verifyOptions, options));
export const verifyNoExpiration = (token) => verify(token, { ignoreExpiration: true });
//# sourceMappingURL=token.js.map