var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { update } from "../stash/stash";
import { BadRequest } from "../application";
export const updateStash = (req, next) => __awaiter(this, void 0, void 0, function* () {
    const response = yield next(req);
    if (!response.originalRequest || !response.originalRequest.body.stash) {
        return response;
    }
    const { previousVersionToken, data } = response.originalRequest.body.stash;
    const user = {
        identificator: response.originalRequest.user
    };
    try {
        response.stash = yield update(user, previousVersionToken, data);
    }
    catch (e) {
        if (e.code === 'ConditionalCheckFailedException') {
            throw new BadRequest(`Previous token doesn't match`);
        }
    }
    return Object.assign({}, response);
});
//# sourceMappingURL=updateStash.js.map