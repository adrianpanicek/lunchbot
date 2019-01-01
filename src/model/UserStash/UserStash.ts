import {Model} from "../Model";
import {hashKey, attribute, rangeKey, table} from "@aws/dynamodb-data-mapper-annotations";
import {IsUUID, Validate} from "class-validator";
import {randomString} from "../../util";
import {Index} from "../Index";
import {MaxBufferLength} from "../validator/MaxBufferLength";
import {binary, deserializeBinary, serializeBinary} from "../../decorator/binary";

const VERSION_TOKEN_LENGTH = 32;
const DATA_BUFFER_LENGTH = 4000;

@table('user_stash')
export class UserStash extends Model {
    @hashKey({
        indexKeyConfigurations: {
            [UserStash.indexes.OnlyVersionByCreatedIndex.name]: 'HASH',
            [UserStash.indexes.ByCreatedIndex.name]: 'HASH'
        }
    })
    @IsUUID()
    user: string;

    @rangeKey({defaultProvider: () => randomString(VERSION_TOKEN_LENGTH)})
    versionToken: string;

    @attribute({defaultProvider: () => ''})
    previousVersionToken: string;

    @attribute({defaultProvider: () => Buffer.alloc(1)})
    @Validate(MaxBufferLength, [DATA_BUFFER_LENGTH])
    @binary()
    data: Buffer;

    @attribute({
        defaultProvider: () => new Date,
        indexKeyConfigurations: {
            [UserStash.indexes.OnlyVersionByCreatedIndex.name]: 'RANGE',
            [UserStash.indexes.ByCreatedIndex.name]: 'RANGE'
        }
    })
    created: Date;

    static indexes: {[key: string]: Index} = {
        OnlyVersionByCreatedIndex: {
            name: 'OnlyVersionByCreatedIndex',
            type: 'local',
            projection: ['versionToken']
        },
        ByCreatedIndex: {
            name: 'ByCreatedIndex',
            type: 'local',
            projection: 'all'
        }
    };

    deserializeData(): UserStash {
        return Object.assign(this, deserializeBinary(this));
    }

    serializeData(): UserStash {
        return Object.assign(this, serializeBinary(this));
    }
}