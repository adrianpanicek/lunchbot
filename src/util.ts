interface Response {
    statusCode: number,
    body: any
}

export function response(data: any, code: number, headers: any = {}): Response {
    return {
        statusCode: code,
        body: JSON.stringify(data)
    };
};

export const responseNotFound = (headers: any = {}): Response => response({}, 404, headers);

export const responseSuccess = (data: any, headers: any = {}): Response => response(data, 200, headers);

export const responseCreated = (data: any, headers: any = {}): Response => response(data, 201, headers);

export const responseDenied = (headers: any = {}): Response => response({}, 403, headers);

export const responseFailed = (data: any, headers: any = {}): Response => response(data, 500, headers);

export const randomString = (length) => [...Array(length)].map(i=>(~~(Math.random()*36)).toString(36)).join('');

const _pipe = (a, b) => (arg) => b(a(arg));
export const pipe = (...ops) => ops.reduce(_pipe)