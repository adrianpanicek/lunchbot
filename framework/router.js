const addRoute = (routes, method, path, action, options) => {
    if (!routes[path])
        routes[path] = {};
    
    routes[path][method] = {
        action,
        options
    };
    
    return {...routes};
};

const matchRoute = (routes, method, path) => {
    const route = routes[path][method] || routes[path]['ANY'];
    
    if (!route)
        throw new Error(`Route for ${method} ${path} not found`);
    
    return route.action;
}

const generateConfig = (routes, config) => {
    const functions = {};
    
    const createName = (method, path) => (method + path).match(/\w+/g).join('_');
    
    for(let method in routes) {
        for(let path in routes[method]) {
            const route = routes[method][path];
            const name = createName(method, path);
            let f = functions[name] || {};
            f.handler = config.handler;
            f.events = f.events || [];
            f.events.push({
                path,
                method,
                options: {...config.defaultOptions, ...route.options}
            });
            
            functions[name] = f;
        }
    }
    
    return functions;
}

class Router {
    constructor(config = {}) {
        const def = {
            handler: 'src/index.handle',
            defaultOptions: {}
        };
        this.config = {...def, ...config};
        this.routes = {};
    }
    
    get(path, action, options = {}) {
        this.routes = addRoute(this.routes, 'GET', path, action, options);
    }
    
    post(path, action, options = {}) {
        this.routes = addRoute(this.routes, 'POST', path, action, options);
    }
    
    put(path, action, options = {}) {
        this.routes = addRoute(this.routes, 'PUT', path, action, options);
    }
    
    patch(path, action, options = {}) {
        this.routes = addRoute(this.routes, 'PATCH', path, action, options);
    }
    
    delete(path, action, options = {}) {
        this.routes = addRoute(this.routes, 'DELETE', path, action, options);
    }
    
    options(path, action, options = {}) {
        this.routes = addRoute(this.routes, 'OPTIONS', path, action, options);
    }
    
    head(path, action, options = {}) {
        this.routes = addRoute(this.routes, 'HEAD', path, action, options);
    }
    
    any(path, action, options = {}) {
        this.routes = addRoute(this.routes, 'ANY', path, action, options);
    }
    
    match(method, path) {
        return matchRoute(this.routes, method, path);
    }
    
    generateConfig() {
        return generateConfig(this.routes, this.config);
    }
}

module.exports.Router = Router;