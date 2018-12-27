var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DynamoDB } from 'aws-sdk';
import { NotFound, responseSuccess } from "../application";
import { run } from "../index";
import { Alias } from '../model/alias';
const dynamo = new DynamoDB.DocumentClient();
const { TABLE_ALIASES } = process.env;
export function action({ pathParameters: { aliasID }, user }) {
    return __awaiter(this, void 0, void 0, function* () {
        const alias = yield Alias.queryOne({ id: { eq: aliasID } }).exec();
        if (!alias) {
            throw new NotFound('Alias not found');
        }
        return responseSuccess(alias);
    });
}
;
export const handle = run(action);
//# sourceMappingURL=get_alias.js.map