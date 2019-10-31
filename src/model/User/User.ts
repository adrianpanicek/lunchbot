import {
    attribute,
    hashKey,
    table,
} from '@aws/dynamodb-data-mapper-annotations';
import {IsEmail, IsUUID, MaxLength, MinLength} from "class-validator";
import {Model} from "../Model";
import {Index} from "../Index";
import {firewall} from "../../decorator/firewall";
import * as bcrypt from "bcryptjs";
import {randomString} from "@app/util";

const REFRESH_TOKEN_LENGTH = 20; // arbitrary hard-code

enum ValidationGroups {
    Registration = 'registration'
}

export enum SecurityLevels {
    RESOURCE_OWNER,
    SERVER
}

@table('users')
export class User extends Model {
    @hashKey()
    @IsUUID("4")
    id: string;

    @attribute({
        indexKeyConfigurations: {
            [User.indexes.EmailIndex.name]: 'HASH'
        }
    })
    @IsEmail()
    email: string;

    @attribute()
    @MinLength(10, {
        message: "Password is too short",
        groups: [ValidationGroups.Registration]
    })
    @MaxLength(255, {
        message: "Password length exceeding limits"
    })
    @firewall(SecurityLevels.SERVER)
    password: string;

    @attribute()
    @firewall(SecurityLevels.SERVER)
    salt: string;

    @attribute({memberType: 'String', defaultProvider: () => new Set})
    @firewall(SecurityLevels.SERVER)
    refreshTokens: Set<string>;

    @attribute({defaultProvider: () => new Date})
    createdAt: Date;

    static indexes: {[key: string]: Index} = {
        EmailIndex: {
            name: 'EmailIndex',
            type: 'global',
            projection: 'all',
            readCapacityUnits: 5,
            writeCapacityUnits: 5
        }
    };

    async createSalt(): Promise<string> {
        return await bcrypt.genSalt();
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    createRefreshToken(): string {
        return randomString(REFRESH_TOKEN_LENGTH);
    }
}