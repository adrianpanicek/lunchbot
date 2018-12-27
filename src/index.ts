import {Application, middlifyAction} from './application';

import {jsonify} from './middleware/jsonify';
import {catchErrors} from "./middleware/catchErrors";
import {updateStash} from "./middleware/updateStash";
import {Database, Transaction} from "./db";

const proxyMapRequest = async (req, next) => {
    const result = {
        headers: req.headers,
        path: req.path,
        user: req.requestContext.authorizer.principalId,
        method: req.httpMethod,
        params: req.queryStringParameters || {},
        body: JSON.parse(req.body),
        resource: req.resource,
        pathParameters: req.pathParameters
    };

    return next(result);
};

export const run = (action) => {
    const app = new Application;

    const transaction = new Transaction(Database);

    // Before
    app.use(proxyMapRequest);

    // After
    app.use(jsonify);
    app.use(catchErrors);
    app.use(updateStash);

    // Add action
    app.use(middlifyAction(action, {transaction}));

    try {
        return async (event, context, ...params) => await app.run(event, context, ...params);
    } catch (e) {
        console.error(e);
    }
}