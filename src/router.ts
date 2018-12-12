import {action} from '../framework';
const yaml = require('../serverless.yml');

console.log(yaml);

export const router = (request) => {
    return action(() => {

    });
};