import {
    attribute,
    hashKey, rangeKey,
    table,
} from '@aws/dynamodb-data-mapper-annotations';
import {Model} from "../Model";
import {Coordinates} from "@app/model/Color/Coordinates";
import {User} from "@app/model/User/User";

@table('colorChanges')
export class ColorChange extends Model {
    @hashKey()
    private _xy: string;

    @rangeKey({defaultProvider: () => new Date})
    private _at: Date;

    @attribute()
    private _c: number;

    @attribute()
    private _u: string;

    public static create(coords: Coordinates, color: number, user: User): ColorChange {
        const colorChange = new ColorChange();

        colorChange._xy = coords.x + ',' + coords.y;
        colorChange._c = color;
        colorChange._u = user.id;

        return colorChange;
    }

    get xy(): string {
        return this._xy;
    }

    get at(): Date {
        return this._at;
    }

    get c(): number {
        return this._c;
    }

    get u(): string {
        return this._u;
    }
}