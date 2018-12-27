var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { responseFailed, response } from "../application";
export const catchErrors = (req, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        return yield next(req);
    }
    catch (e) {
        if (typeof e !== 'object' || !e.code) {
            console.error('Unknown error', e);
            return responseFailed('Unknown error');
        }
        console.log('Response error', e);
        const error = {
            code: e.code,
            message: e.message
        };
        return response(error, { code: e.code });
    }
});
//# sourceMappingURL=catchErrors.js.map