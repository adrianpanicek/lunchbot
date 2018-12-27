var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Application, middlifyAction } from './application';
import { jsonify } from './middleware/jsonify';
import { catchErrors } from "./middleware/catchErrors";
import { updateStash } from "./middleware/updateStash";
const proxyMapRequest = (req, next) => __awaiter(this, void 0, void 0, function* () {
    const result = {
        headers: req.headers,
        path: req.path,
        user: req.requestContext.authorizer.principalId,
        method: req.httpMethod,
        params: req.queryStringParameters,
        body: JSON.parse(req.body),
        resource: req.resource,
        pathParameters: req.pathParameters
    };
    return next(result);
});
export const run = (action) => {
    const app = new Application;
    // Before
    app.use(proxyMapRequest);
    // After
    app.use(jsonify);
    app.use(catchErrors);
    app.use(updateStash);
    // Add action
    app.use(middlifyAction(action));
    try {
        return (event, context, ...params) => __awaiter(this, void 0, void 0, function* () { return yield app.run(event, context, ...params); });
    }
    catch (e) {
        console.error(e);
    }
};
//# sourceMappingURL=index.js.map