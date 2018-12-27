import { Schema, model } from '../db';
import { validateUuid } from "../util";
const validateAliasName = name => name.match(/[\w\d\._]{0, 32}/);
const stripPrefixSign = (name) => name.replace(/^@/, '');
const schemaOptions = {
    useNativeBooleans: true,
    useDocumentTypes: true
};
const sharedKeys = {
    id: {
        type: String,
        validate: validateUuid,
        hashKey: true
    },
    level: {
        type: Number,
        validate: n => Number.isInteger(n) && n >= 0 && n <= 3,
        rangeKey: true
    }
};
const levels = [];
levels[0] = () => {
    const schema = {
        aliasName: {
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
        private: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: '',
            trim: true,
            set: v => v.substring(0, 255)
        },
        imageUrl: {
            type: String,
            default: ''
        },
        publicKey: {
            type: Buffer
        },
        updated: {
            type: Date
        },
    };
    schema.aliasName.index.project = Object.keys(schema); // Project all Level0 keys
    return schema;
};
levels[1] = () => {
    return {
        versionToken: {
            type: String,
            required: true
        },
        data: {
            type: Buffer
        }
    };
};
levels[2] = () => {
    return {
        discoverable: {
            type: Boolean,
            default: true
        },
        updatedPrivate: {
            type: Date
        } // Timestamp of last update on level 0, 1 or 2
    };
};
levels[3] = () => {
    return {
        accessTokens: {
            type: [String]
        }
    };
};
export const AliasSchema = new Schema(Object.assign({}, sharedKeys, levels.reduce((c, l) => (Object.assign({}, l, c)))), schemaOptions);
export const AliasLevel = levels.map(l => new Schema(Object.assign({}, sharedKeys, l())));
export const Alias = model('Alias', AliasSchema);
//# sourceMappingURL=alias.js.map