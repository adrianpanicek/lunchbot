import {IsUUID} from "class-validator";
import {Model} from "@app/model/Model";
import * as jwt from "jsonwebtoken";
import {VerifyOptions} from "jsonwebtoken";
import {SignOptions} from "jsonwebtoken";
import * as _ from "lodash";
import {firewall} from "@app/decorator/firewall";

const {TOKEN_EXPIRATION, TOKEN_SECRET} = process.env;
const defaultVerifyOptions: VerifyOptions = {
    clockTolerance: 30 * 60
};
const defaultSignOptions: SignOptions = {
    expiresIn: TOKEN_EXPIRATION
};

export class AccessToken extends Model {
    @IsUUID("4")
    @firewall(42)
    user: string;

    async sign(options: SignOptions = {}): Promise<string> {
        return await jwt.sign(_.toPlainObject(this), TOKEN_SECRET, {...defaultSignOptions, ...options});
    }

    static fromString(token: string, options: VerifyOptions = {}): AccessToken {
        const data = jwt.verify(token, TOKEN_SECRET, {...defaultVerifyOptions, ...options}) as object;
        return Object.assign(new this, data);
    }
}