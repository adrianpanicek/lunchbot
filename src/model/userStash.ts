import {Database, Schema} from "../db";
import {randomString, validateUuid} from "../util";
import {Denied} from "../application";

const TOKEN_LENGTH = 32;

export const validateVersionToken = (token) => token.length == TOKEN_LENGTH;

const versionTokenIndex = {
    global: false,
    rangeKey: 'versionToken',
    name: 'VersionTokenOnlyIndex',
    project: ['created']
};

const onlyVersionCreatedIndex = {
    global: false,
    rangeKey: 'created',
    name: 'ByCreatedIndex',
    project: ['versionToken']
};

const createdIndex = {
    global: false,
    rangeKey: 'created',
    name: 'OnlyVersionByCreatedIndex',
    project: true
};

const schema = new Schema({
    id: { // User id
        type: String,
        //validate: validateUuid,
        hashKey: true
    },
    versionToken: {
        type: String,
        validate: validateVersionToken,
        default: () => randomString(TOKEN_LENGTH),
        rangeKey: true,
        index: onlyVersionCreatedIndex
    },
    previousVersionToken: {
        type: String,
        default: () => ''
    },
    data: {
        type: Buffer,
        default: () => Buffer.alloc(1),
        // @ts-ignore
        get: e => (e as Buffer).toString('base64'),
        set: s => Buffer.from(s, 'base64')
    },
    created: {
        type: Date,
        default: () => new Date,
        index: createdIndex
    }
});

schema.statics.update = async function(user, previousVersionToken, data) {
    const previous = await this.queryOne({id: {eq: user}})
        .descending()
        .using(onlyVersionCreatedIndex.name)
        .exec();

    if(previous && previous.versionToken !== previousVersionToken) {
        throw new Denied('Parameter previousVersionToken does not match version of last token recorded');
    }

    return await this.create({
        id: user,
        previousVersionToken,
        data
    });
};

schema.statics.getLatest = async function(user) {
    return await this.queryOne({id: {eq: user}})
        .descending()
        .using(createdIndex.name)
        .exec();
};

export const Stash = Database.model('Stash', schema)