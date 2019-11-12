import {run} from "@app/index";
import {responseSuccess} from "@app/application";
import crypto from 'crypto';
import AWS from "aws-sdk";
import {restaurants} from "@app/restaurants";
import {RestaurantDay} from "@app/model/RestaurantDay";

const s3 = new AWS.S3();
const {SLACK_SECRET, S3BUCKET} = process.env;

const sign = (body, path, timestamp) =>
    'v0='+crypto.createHmac('sha256', SLACK_SECRET)
        .update(`v0:${timestamp}:${path}?${body}`)
        .digest('hex');

const buildUrl = (filename: string) => `https://${S3BUCKET}.s3.amazonaws.com/${filename}`;

export const handler = run(async ({body, headers, path}) => {
    const signature = sign(body, path, headers['X-Slack-Request-Timestamp']);

    const blocks = Object.values(restaurants).map(restaurant => {
        const day = new RestaurantDay(restaurant, new Date);

        return {
            type: "image",
            title: {
                type: "plain_text",
                text: restaurant.fancyName
            },
            image_url: buildUrl(day.generateFileName()),
            alt_text: restaurant.fancyName
        };
    });

    return responseSuccess({
        blocks,
        response_type: "in_channel"
    }, {
        headers: {
            'X-Slack-Signature': signature,
            'Content-Type': 'application/json'
        }
    });
});