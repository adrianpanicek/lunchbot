import * as db from '../db';
import * as uuid from 'uuid';

const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/;

export const schema = new db.Schema({
    id: {
        type: String,
        validate: v => v.match(uuidv4Regex),
        hashKey: true
    },

});