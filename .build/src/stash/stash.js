var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { randomString } from "../util";
import { DynamoDB } from 'aws-sdk';
const dynamo = new DynamoDB.DocumentClient();
const { TABLE_STASHES: TableName } = process.env;
export function update(user, previousVersionToken, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield dynamo.update({
            TableName,
            Key: {
                userID: user.identificator
            },
            UpdateExpression: 'SET #stash_data = :d, #stash_token = :t',
            ExpressionAttributeNames: { '#stash_data': 'data', '#stash_token': 'versionToken' },
            ExpressionAttributeValues: { ':d': data, ':t': randomString(32), ':pt': previousVersionToken },
            ConditionExpression: 'attribute_not_exists(#stash_token) OR #stash_token = :pt',
            ReturnValues: "ALL_NEW"
        }).promise();
    });
}
//# sourceMappingURL=stash.js.map