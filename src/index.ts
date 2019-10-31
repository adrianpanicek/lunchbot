import {Application, middlifyAction} from './application';

import {jsonify} from './middleware/jsonify';
import {catchErrors} from "./middleware/catchErrors";

const proxyMapRequest = async (req, next) => {
    const result = {
        headers: req.headers,
        path: req.path,
        user: req.requestContext.authorizer? req.requestContext.authorizer.principalId : null,
        method: req.httpMethod,
        params: req.queryStringParameters || {},
        body: req.body? JSON.parse(req.body) : {},
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