'use strict';

import { DynamoDB } from 'aws-sdk'

const dynamo = new DynamoDB.DocumentClient()

interface Alias {
  aliasId: string,
  name: string
}

function findAlias(aliasName: string): Promise<Alias> {
  return new Promise((resolve, reject) => {
    let resource = dynamo.get({
      TableName: 'dev-aliases',
      Key: {aliasID: aliasName}
    });
    resource.send((err, data) => {
      if(err) return reject(err);

      resolve(data.Item as Alias);
    });
  });
}

export async function get(event, context) {
  try {
    let alias: Alias = await findAlias(event.queryStringParameters.aliasName);
    if(!alias) {
      return {statusCode: 404};
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        aliases: [
          alias
        ]
      }),
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  }
};
