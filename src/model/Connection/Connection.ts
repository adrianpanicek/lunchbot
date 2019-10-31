import {hashKey, table} from "@aws/dynamodb-data-mapper-annotations";
import {Model} from "@app/model/Model";

@table('connections')
export class Connection extends Model {
    @hashKey()
    private _id: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }
}