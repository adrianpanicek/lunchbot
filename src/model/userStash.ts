import {Database, Schema} from "../db";
import {randomString, validateUuid} from "../util";

const TOKEN_LENGTH = 32;

export const validateVersionToken = (token) => token.length == TOKEN_LENGTH;

const schema = new Schema({
    id: { // User id
        type: String,
        validate: validateUuid,
        hashKey: true
    },
    versionToken: {
        type: String,
        validate: validateVersionToken,
        default: () => randomString(TOKEN_LENGTH),
        rangeKey: true
    },
    previousVersionToken: {
        type: String,
        validate: validateVersionToken
    },
    data: {
        type: Buffer,
        default: () => Buffer.alloc(1),
        // @ts-ignore
        get: e => (e as Buffer).toString('base64'),
        set: s => Buffer.from(s, 'base64')
    }
});

schema.method('update', function(user, previousVersionToken, data) {
    this.save({
        condition: 'attribute_exists'
    });
});

export const Stash = Database.model('Stash', schema)