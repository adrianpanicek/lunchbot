var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DynamoDB } from 'aws-sdk';
import { run } from '..';
import { BadRequest, Failed, responseSuccess } from "../application";
const dynamo = new DynamoDB.DocumentClient();
const { TABLE_STASHES: TableName } = process.env;
export function action({ user: identificator }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = {
            identificator
        };
        if (!user.identificator) {
            console.error("Unknown user");
            throw new BadRequest("Unknown user");
        }
        try {
            let { Item: stash } = yield getStash(user);
            return responseSuccess({ stash });
        }
        catch (e) {
            console.error(e);
            throw new Failed(e);
        }
    });
}
export function getStash(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield dynamo.get({
            TableName,
            Key: {
                userID: user.identificator
            }
        }).promise();
    });
}
export const handle = run(action);
//# sourceMappingURL=get_stash.js.map