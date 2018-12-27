var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
;
const run = (request, middleware) => __awaiter(this, void 0, void 0, function* () { return middleware[0] ? yield middleware[0](request, res => run(res, middleware.slice(1))) : request; });
export const middlifyAction = (action) => (req, next) => __awaiter(this, void 0, void 0, function* () {
    let response = yield action(req);
    console.log('Action response was', response);
    response.originalRequest = req;
    return yield next(response);
});
export class Application {
    constructor() {
        this.middleware = [];
    }
    use(middleware) {
        this.middleware.push(middleware);
    }
    ;
    run(event, context, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield run(event, this.middleware);
        });
    }
    ;
}
;
export function response(data, opt) {
    const response = {};
    if (typeof data !== undefined) {
        response.body = data;
    }
    response.statusCode = opt.code;
    return response;
}
;
export const responseNotFound = (opt) => response(undefined, Object.assign({ code: 404 }, opt));
export const responseSuccess = (data, opt) => response(data, Object.assign({ code: 200 }, opt));
export const responseCreated = (data, opt) => response(data, Object.assign({ code: 201 }, opt));
export const responseDenied = (opt) => response(undefined, Object.assign({ code: 403 }, opt));
export const responseFailed = (data, opt) => response(data, Object.assign({ code: 500 }, opt));
export class HttpError extends Error {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(message) {
        super(message);
        this.code = this.getError();
    }
}
;
export class NotFound extends HttpError {
    getError() {
        return 404;
    }
}
;
export class Denied extends HttpError {
    getError() {
        return 403;
    }
}
export class BadRequest extends HttpError {
    getError() {
        return 400;
    }
}
export class Conflict extends HttpError {
    getError() {
        return 409;
    }
}
export class Failed extends HttpError {
    getError() {
        return 500;
    }
}
//# sourceMappingURL=application.js.map