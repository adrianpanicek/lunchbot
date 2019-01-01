import {Model} from "../Model";
import {hashKey, attribute, table} from "@aws/dynamodb-data-mapper-annotations";
import {IsUUID} from "class-validator";
import {randomString} from "../../util";

const REFRESH_TOKEN_LENGTH = 20;

@table('user_refresh_token')
export class UserRefreshToken extends Model {
    @hashKey({defaultProvider: () => randomString(REFRESH_TOKEN_LENGTH)})
    token: string;

    @attribute()
    @IsUUID("4")
    user: string;

    @attribute({
        defaultProvider: () => new Date
    })
    createdAt: Date;
}