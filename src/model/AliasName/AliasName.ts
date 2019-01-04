import {Model} from "../Model";
import {table, hashKey, attribute} from "@aws/dynamodb-data-mapper-annotations";

@table('alias_name')
export class AliasName extends Model {
    @hashKey()
    name: string;

    @attribute()
    alias: string;

    @attribute({defaultProvider: () => new Date})
    createdAt: Date;
}