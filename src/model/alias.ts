import {Schema, SchemaAttributes, Database} from '../db';
import {randomString, validateUuid} from "../util";
import {ModelConstructor} from 'dynamoose';

const validateAliasName = name => !!name.match(/[\w\d\.\_]+/) && name.length > 2 && name.length <= 32;
const stripPrefixSign = (name: String) => name.replace(/^@/, '');

const schemaOptions = {
    useNativeBooleans: true,
    useDocumentTypes: true
};

const sharedKeys = {
    id: {
        type: String,
        validate: validateUuid,
        hashKey: true
    }
};

const levels = [];

levels[0] = (): SchemaAttributes => {
    const schema = {
        user: {
            type: String
        },
        aliasName: { // Alias world string identificator without @ at the beginning
            type: String,
            validate: validateAliasName,
            required: true,
            trim: true,
            index: {
                global: true,
                project: [],
                throughput: 5
            }
        },
        private: { // Todo: Better clarify this parameter
            type: Boolean,
            default: false
        },
        name: { // Citizen name
            type: String,
            default: '',
            trim: true,
            set: v => v.substring(0, 255)
        },
        imageUrl: { // Url of thumbnail image
            type: String,
            default: ''
        },
        publicKey: {
            type: Buffer,
            default: () => Buffer.alloc(1),
            get: e => (e as Buffer).toString('base64'),
            set: s => Buffer.from(s, 'base64')
        },
        updated: {
            type: Date,
            default: () => Date.now()
        }, // UTC timestamp of last update of L0 or L1
    };

    schema.aliasName.index.project = Object.keys(schema); // Project all Level0 keys

    // @ts-ignore
    return schema;
};

levels[1] = (): SchemaAttributes => {
    return {
        versionToken: {
            type: String,
            default: () => randomString(32) // TODO: HARDCODE!
        },
        data: {
            type: Buffer,
            default: () => Buffer.alloc(1),
            // @ts-ignore
            get: e => (e as Buffer).toString('base64'),
            set: s => Buffer.from(s, 'base64')
        }
    };
};

levels[2] = (): SchemaAttributes => {
    return {
        discoverable: {
            type: Boolean,
            default: true
        },
        updatedPrivate: {
            type: Date,
            default: () => Date.now()
        } // Timestamp of last update on level 0, 1 or 2
    };
};

export const AliasSchema = new Schema({...sharedKeys, ...levels.reduce((c, l) => ({...l(), ...c}), {})}, schemaOptions);
export const Alias = Database.model('Alias', AliasSchema);