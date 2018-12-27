import { setDDB, setDefaults, AWS } from 'dynamoose';
const { TABLE_PREFIX } = process.env;
setDDB(new AWS.DynamoDB());
setDefaults({ prefix: TABLE_PREFIX });
export { Schema, Model, model } from 'dynamoose';
//# sourceMappingURL=db.js.map