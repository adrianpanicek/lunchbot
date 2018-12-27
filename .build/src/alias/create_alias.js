var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DynamoDB } from 'aws-sdk';
import { Conflict, responseCreated } from '../application';
import { run } from '../index';
const db = new DynamoDB.DocumentClient();
const { TABLE_ALIASES } = process.env;
export function action({ body: alias }) {
    return __awaiter(this, void 0, void 0, function* () {
        const Item = Object.assign({}, alias);
        try {
            yield db.put({
                TableName: TABLE_ALIASES,
                Item
            }).promise();
        }
        catch (e) {
            console.log(e);
            throw new Conflict('Alias with this ID already exists');
        }
        return responseCreated({
            alias: Item
        });
    });
}
;
export const handle = run(action);
//# sourceMappingURL=create_alias.js.map