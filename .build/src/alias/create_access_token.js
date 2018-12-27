var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DynamoDB } from 'aws-sdk';
import * as crypto from 'crypto';
import { responseCreated } from "../application";
import { run } from "../index";
const dynamo = new DynamoDB.DocumentClient();
const { TABLE_ALIASES: TableName } = process.env;
const generateRandomToken = (len) => {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len); // return required number of characters
};
export function action({ pathParameters: { aliasID } }) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenLength = 128; // TODO: extract to config
        const accessToken = generateRandomToken(tokenLength);
        yield dynamo.update({
            TableName,
            Key: { aliasID },
            UpdateExpression: 'ADD aliasAccessTokens :c',
            ExpressionAttributeValues: { ':c': dynamo.createSet([accessToken]) }
        }).promise();
        return responseCreated({ accessToken });
    });
}
export const handle = run(action);
//# sourceMappingURL=create_access_token.js.map