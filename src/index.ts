import {Application} from '../framework/index';
import {router} from "./router";

import {jsonify} from './middleware/jsonify';
import {proxyFormat} from './middleware/proxyFormat';

const logRequest = async (req, next) => {
    console.log(req);
    return next({...req});
};

const proxyMapRequest = async (req, next) => {
    const res = {
        headers: req.headers,
        path: req.path,
        user: req.requestContext.authorizer.principalId,
        method: req.httpMethod,
        params: req.queryStringParameters,
        body: JSON.parse(req.body),
        resource: req.resource,
        pathParameters: req.pathParameters
    };

    return next({...res});
};

export const handle = async (event, context) => {
    const app = new Application;

    app.use(proxyMapRequest);
    app.use(logRequest);
    app.use(proxyFormat);
    app.use(jsonify);

    const action = router(event, context);
    app.use(action);
    try {
        return await app.run(event);
    } catch (e) {
        console.error(e);
    }
}