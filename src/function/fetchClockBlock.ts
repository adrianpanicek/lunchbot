import {run} from '@app/index';
import fetch from "node-fetch";
import {JSDOM} from 'jsdom';
import sharp from 'sharp';
import AWS from 'aws-sdk';
import {responseSuccess} from "@app/application";
import {RestaurantKey, restaurants} from "@app/restaurants";
import {RestaurantDay} from "@app/model/RestaurantDay";

const {S3BUCKET} = process.env;
const pageUrl = 'https://clockblock.sk/';
const s3 = new AWS.S3();

const extraction = {
    offsetTop: 700,
    dayHeight: 425,
    extension: 120
};

const createFileName = (date: Date) => `ClockBlock_${date.toISOString().slice(0, 10)}.jpg`;

export const handler = run(async () => {
    const fetchedPage = await fetch(pageUrl);
    const dom = new JSDOM(await fetchedPage.text());
    const imageUrl = dom.window.document.querySelector(`a[href*='poludnajsia'].pixcode`).getAttribute('href');

    // fetch image
    const fetchedImage = await fetch(imageUrl);
    const image = await fetchedImage.buffer();

    const dimensions = await sharp(image)
        .toBuffer({resolveWithObject: true})
        .then(o => o.info);

    const dayOfWeek = (new Date).getDay(); // indexed from 0, where 0 is sunday
    const day = new RestaurantDay(restaurants[RestaurantKey.CLOCK_BLOCK], new Date);

    await sharp(image)
        .extract({
            top: extraction.offsetTop + dayOfWeek * extraction.dayHeight - extraction.extension,
            left: 0,
            height: extraction.dayHeight + extraction.extension,
            width: dimensions.width
        })
        .toBuffer()
        .then(async buffer => await s3.putObject({
            Bucket: S3BUCKET,
            Key: day.generateFileName(),
            Body: buffer,
            ACL: "public-read"
        }).promise());

    return responseSuccess({});
});