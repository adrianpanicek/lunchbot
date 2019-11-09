export type Request = {

};

export interface Response {
    body: any,
    statusCode: Number
};

export type ActionResult = object | Number | String ;

export type Middleware = (Request, Middleware) => Request;

export type Container = {[name: string]: any};
export type Action = (Request, Container?) => any;

export interface ResponseOptions {
    code?: Number,
    headers?: {[key:string]: string}
};

export const run = async (request: Request, middleware: Middleware[]): Promise<Request> => middleware[0]? await middleware[0](request, res => run(res, middleware.slice(1))) : request;

export const middlifyAction = (action: Action, container: Container): Middleware => async (req, next) => {
    let response = await action(req, container);
    console.log('Action response was', response);

    response.originalRequest = req;

    return await next(response)
};

export function response(data: ActionResult, opt: ResponseOptions): Response {
    const response: any = {};
    if (typeof data !== undefined) {
        response.body = data;
    }
    response.statusCode = opt.code;

    return response as Response;
};

export const responseNotFound = (opt?: ResponseOptions): Response => response(undefined, {code: 404, ...opt});

export const responseSuccess = (data: ActionResult, opt?: ResponseOptions): Response => response(data, {code: 200, ...opt});

export const responseCreated = (data: ActionResult, opt?: ResponseOptions): Response => response(data, {code: 201, ...opt});

export const responseDenied = (opt?: ResponseOptions): Response => response(undefined, {code: 403, ...opt});

export const responseFailed = (data: ActionResult, opt?: ResponseOptions): Response => response(data, {code: 500, ...opt});


export abstract class HttpError extends Error {
    code: Number;

    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(message?: string) {
        super(message);
        this.code = this.getError();
    }

    abstract getError(): Number;
};

export class NotFound extends HttpError {
    getError() {
        return 404;
    }
};

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
