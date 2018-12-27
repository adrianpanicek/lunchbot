import {Schema, Database, ModelConstructor} from "../db";

const schema = new Schema({
    id: { // Id of alias
        type: String,
        hashKey: true
    },
    accessToken: {
        type: String,
        rangeKey: true
    }
}, {
    timestamps: true
});

export const AliasAccessToken = Database.model('AliasAccessToken', schema);