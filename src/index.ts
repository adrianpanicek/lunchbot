import {run as runApp, middlifyAction, Middleware} from './application';

import {dejsonify} from './middleware/dejsonify';
import {jsonify} from './middleware/jsonify';
import {catchErrors} from "./middleware/catchErrors";

const proxyMapRequest = async (req, next) => {
    const result = {
        headers: req.headers,
        params: req.queryStringParameters || {},
        body: req.body,
        resource: req.resource,
        pathParameters: req.pathParameters,
        context: req.requestContext
    };

    return next(result);
};

export const run = (action) => {
    const middlewares: Array<Middleware> = [];

    // Before
    middlewares.push(proxyMapRequest);
    middlewares.push(dejsonify);

    // After
    middlewares.push(jsonify);
    middlewares.push(catchErrors);

    // Add action
    middlewares.push(middlifyAction(action, {}));

    try {
        return async (event) => await runApp(event, middlewares);
    } catch (e) {
        console.error(e);
    }
}