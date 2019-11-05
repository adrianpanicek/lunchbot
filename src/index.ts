import {Application, middlifyAction} from './application';

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
    const app = new Application;

    // Before
    app.use(proxyMapRequest);
    app.use(dejsonify);

    // After
    app.use(jsonify);
    app.use(catchErrors);

    // Add action
    app.use(middlifyAction(action, {}));

    try {
        return async (event, context, ...params) => await app.run(event, context, ...params);
    } catch (e) {
        console.error(e);
    }
}