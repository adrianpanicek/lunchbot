import * as AWS from "aws-sdk";
import * as util from "util";
import {getRepository} from "@app/model/Repository";
import {ConnectionRepository} from "@app/model/Connection/ConnectionRepository";
import {Connection} from "@app/model/Connection/Connection";
import {Marshaller} from '@aws/dynamodb-auto-marshaller';
import * as _ from "lodash";
import {AttributeMap} from "aws-sdk/clients/dynamodb";

const {WS_DOMAIN, ENVIRONMENT} = process.env;

export async function handle(event) {
    event.Records.map(console.log);
    const records = event.Records
        .filter(record => !!record.dynamodb)
        .map(record => record.dynamodb.NewImage).filter(record => !!record);

    if (records.length == 0) {
        console.log("No records to stream");
        return;
    }

    const callback = util.format(util.format('https://%s/%s', WS_DOMAIN, ENVIRONMENT));
    const repository = await getRepository<ConnectionRepository>(ConnectionRepository);

    try {
        for await (const connection of repository.scan({})) {
            console.log('Broadcasting message to ' + connection.id);
            await sendMessageToClient(callback, connection.id, buildMessage(records));
        }

        return {
            responseCode: 200
        }
    } catch (e) {
        console.error(e);
        return {
            body: e.message,
            responseCode: 500
        }
    }
}

async function sendMessageToClient(url: string, connectionId: string, payload: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const gateway = new AWS.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: url,
        });

        gateway.postToConnection({
                ConnectionId: connectionId,
                Data: payload,
            }, (err) => {
                if (err) {
                    console.error('Error while sending data to client', err);
                    reject(err);
                }
                resolve();
            }
        );
    });
}

function buildMessage(records: Array<object>): string {
    const marsh = new Marshaller();

    const extractValues = (x: any): {[key: string]: string} => _.mapValues(x, (v: {value: any}) => v.value || v)

    return _(records).map(record => marsh.unmarshallItem(record as AttributeMap))
        .map(extractValues)
        .map(color => color._xy + ',' + color._c)
        .join("\n");
}