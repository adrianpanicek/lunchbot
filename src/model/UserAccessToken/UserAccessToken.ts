import {Model} from "../Model";
import {IsUUID} from "class-validator";
import * as jwt from "jsonwebtoken";
import * as _ from "lodash";

const {TOKEN_SECRET, TOKEN_EXPIRATION} = process.env;

export class UserAccessToken extends Model {
    @IsUUID("4")
    user: string;

    async sign(options = {}) {
        const defaultOptions = {
            expiresIn: TOKEN_EXPIRATION
        };

        return await jwt.sign(_.toPlainObject(this), TOKEN_SECRET, {...defaultOptions, ...options});
    }
}