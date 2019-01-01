export class VersionMismatch extends Error {
    code: string;
    constructor(public message, ...params) {
        super(...params);
        this.code = 'VersionMismatch';
    }
}