import {Application} from '../framework/index';
import {router} from "./router";

import {jsonify} from './middleware/jsonify';
import {decode} from './middleware/decode';
import {proxyFormat} from './middleware/proxyFormat';

export const handle = async (event, context) => {
    const app = new Application;

    app.use(decode);
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