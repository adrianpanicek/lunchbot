import {run} from '@app/index';
import fetch from "node-fetch";
import {JSDOM} from 'jsdom';
import sharp from 'sharp';
import AWS from 'aws-sdk';
import {responseSuccess} from "@app/application";

const {S3BUCKET} = process.env;
const pageUrl = 'https://clockblock.sk/';
const s3 = new AWS.S3();

const extraction = {
    offsetTop: 700,
    dayHeight: 425,
    extension: 120
};

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

    await sharp(image)
        .extract({
            top: extraction.offsetTop + (dayOfWeek - 1) * extraction.dayHeight - extraction.extension,
            left: 0,
            height: extraction.dayHeight + extraction.extension,
            width: dimensions.width
        })
        .toBuffer()
        .then(async buffer => await s3.putObject({
            Bucket: S3BUCKET,
            Key: `ClockBlock.jpg`,
            Body: buffer,
        }).promise());

    return responseSuccess({});
});