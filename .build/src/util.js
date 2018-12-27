export const validateUuid = uuid => uuid.match(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/);
export const randomString = (length) => [...Array(length)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
const _pipe = (a, b) => (arg) => b(a(arg));
export const pipe = (...ops) => ops.reduce(_pipe);
//# sourceMappingURL=util.js.map