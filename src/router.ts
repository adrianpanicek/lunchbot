import {action} from '../framework';

const {TABLE_PREFIX} = process.env;

const routes = {
    test: (req) => { return 'Hello World'; }
};

const createRegExp = (prefix) => new RegExp("^" + prefix + "(.*)$");

export const router = (request, context) => {
    if (!context.functionName)
        throw new Error('Undefined function name');

    const functionName = context.functionName.match(createRegExp(TABLE_PREFIX))[1];
    if (!functionName || !routes[functionName])
        throw new Error(`Function ${functionName} not found`);

    return action(routes[functionName]);
};