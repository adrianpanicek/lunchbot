import {run} from "@app/index";
import {responseSuccess} from "@app/application";
import _ from "lodash";
import crypto from 'crypto';

const {SLACK_SECRET} = process.env;

const sign = (params, path, timestamp) =>
    'v0='+crypto.createHmac('SHA-256', SLACK_SECRET)
        .update(`v0:${timestamp}:${path + "?" +_.mapKeys(params, (v, k) => k+'='+v).keys().join('&')}`)
        .digest('hex');

export const handler = run(async ({params, headers, path}) => {
    const signature = sign(params, path, headers['X-Slack-Request-Timestamp']);

    return responseSuccess({
        "response_type": "in_channel",
        "text": "I'm a teapot",
    }, {headers: {'X-Slack-Signature': signature}});
});