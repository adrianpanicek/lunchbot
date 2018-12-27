var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import { run } from "../index";
import { Conflict, responseCreated } from "../application";
const db = new DynamoDB.DocumentClient();
const { TABLE_USERS } = process.env;
export function action({ body: { email, password } }) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt.genSalt();
        const user = {
            identificator: email,
            salt,
            password: yield bcrypt.hash(password, salt),
            refreshTokens: []
        };
        try {
            yield db.put({
                TableName: TABLE_USERS,
                Item: user,
                ConditionExpression: "attribute_not_exists(email)",
                ReturnValues: "ALL_OLD"
            }).promise();
        }
        catch (e) {
            console.error(e);
            throw new Conflict("User with that email already exists");
        }
        return responseCreated(user);
    });
}
export const handle = run(action);
//# sourceMappingURL=register.js.map