const run = async (request, middleware) => middleware[0]? await middleware[0](request, res => run(res, middleware.slice(1))) : request;

export const action = (action) => async (req, next) => {
    let res = action(req);
    switch (typeof res) {
        case 'object':
            return next({...res});
        case 'undefined':
            return next({});
        default:
            return next({body: res});
    }
};

export class Application {
    constructor() {
        this.middleware = [];
    }

    use(middleware) {
        this.middleware.push(middleware);
    };

    async run(request) {
        return await run(request, this.middleware);
    };
};