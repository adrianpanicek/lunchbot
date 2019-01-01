import {Model} from "../Model";
import {table, hashKey, attribute} from "@aws/dynamodb-data-mapper-annotations";
import {IsDefined, IsUrl, IsUUID, Length} from "class-validator";
import {randomString} from "../../util";
import {binary} from "../../decorator/binary";
import {firewall} from "../../decorator/firewall";
import {Index} from "../Index";

const VERSION_TOKEN_LENGTH = 64;

export enum AliasSecurityLevel {
    PUBLIC,
    PROTECTED, // You need to have access token for this
    RESOURCE_OWNER, // You need to own this alias
    SERVER
}

@table('alias')
export class Alias extends Model {
    @hashKey()
    @IsUUID("4")
    id: string;

    @attribute()
    @IsUUID("4")
    user: string;

    @attribute({
        indexKeyConfigurations: {
            [Alias.indexes.AliasNameIndex.name]: 'HASH'
        }
    })
    @IsDefined()
    aliasName: string;

    @attribute({defaultProvider: () => false})
    private: boolean;

    @attribute()
    @Length(0, 255)
    name: string;

    @attribute()
    @IsUrl()
    imageUrl?: string;

    @attribute()
    @IsDefined()
    @binary()
    publicKey: Buffer;

    @attribute({defaultProvider: () => new Date})
    updated: Date;

    @firewall(AliasSecurityLevel.PROTECTED)
    @attribute({defaultProvider: () => randomString(VERSION_TOKEN_LENGTH)})
    versionToken: string;

    @attribute()
    @IsDefined()
    @binary()
    @firewall(AliasSecurityLevel.PROTECTED)
    data: Buffer;

    @attribute({defaultProvider: () => true})
    @firewall(AliasSecurityLevel.RESOURCE_OWNER)
    discoverable: boolean;

    @attribute({defaultProvider: () => new Date})
    @firewall(AliasSecurityLevel.RESOURCE_OWNER)
    updatedPrivate: Date;

    static indexes: {[key: string]: Index} = {
        AliasNameIndex: {
            name: 'AliasNameIndex',
            type: 'local',
            projection: 'all'
        }
    };
}