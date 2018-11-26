interface Response {
    statusCode: number,
    body: any
}

export function response(data: any, code: number = 200, headers: any = {}): Response {
    return {
        statusCode: code,
        body: JSON.stringify(data)
    };
};

export const responseSuccess = (data: any, headers: any = {}): Response => response(data, 200, headers);

export const responseCreated = (data: any, headers: any = {}): Response => response(data, 201, headers);

export const randomString = (length) => [...Array(length)].map(i=>(~~(Math.random()*36)).toString(36)).join('');

const _pipe = (a, b) => (arg) => b(a(arg));
export const pipe = (...ops) => ops.reduce(_pipe)