import {Model} from "../Model";
import {table, hashKey, rangeKey, attribute} from "@aws/dynamodb-data-mapper-annotations";
import {IsDefined} from "class-validator";

@table('alias_access_token')
export class AliasAccessToken extends Model {
    @hashKey()
    @IsDefined()
    alias: string;

    @rangeKey()
    @IsDefined()
    accessToken: string;

    @attribute({defaultProvider: () => new Date})
    createdAt: Date;
}