import {AWS} from 'dynamoose';
const db = require('dynamoose');

const {TABLE_PREFIX} = process.env;

db.setDDB(new AWS.DynamoDB());
db.setDefaults({prefix: TABLE_PREFIX, update: true});

export class Transaction {
    database;
    transaction = [];

    constructor(database) {
        this.database = database;
    }

    transact(fun) {
        this.transaction.push(fun);
    }

    async commit() {
        if (this.transaction.length < 1)
            return;

        return await this.database.transaction(this.transaction);
    }
}

export const Database = db;
export {Schema, SchemaAttributes, Model, ModelConstructor} from 'dynamoose';