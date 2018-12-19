import {setDDB, setDefaults, AWS} from 'dynamoose';

const {TABLE_PREFIX} = process.env;

setDDB(new AWS.DynamoDB());
setDefaults({create: false, prefix: TABLE_PREFIX});

export {Schema} from 'dynamoose';