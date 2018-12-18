





export const randomString = (length) => [...Array(length)].map(i=>(~~(Math.random()*36)).toString(36)).join('');

const _pipe = (a, b) => (arg) => b(a(arg));
export const pipe = (...ops) => ops.reduce(_pipe)