import {Model} from "../Model";
import {table, hashKey, rangeKey, attribute} from "@aws/dynamodb-data-mapper-annotations";
import {IsDefined} from "class-validator";
import {randomString} from "../../util";

const ACCESS_TOKEN_LENGTH = 40;

@table('alias_access_token')
export class AliasAccessToken extends Model {
    @hashKey()
    @IsDefined()
    alias: string;

    @rangeKey({defaultProvider: () => randomString(ACCESS_TOKEN_LENGTH)})
    @IsDefined()
    accessToken: string;

    @attribute({defaultProvider: () => new Date})
    createdAt: Date;
}