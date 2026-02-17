const http = require('http');
const EventEmitter = require('events');

module.exports = class Application {
    constructor() {
        this.emitter = new EventEmitter();
        this.server = this._createServer();
        this.middlewares = [];
        this.routes = []; 
    }
    
    use(middleware) {
        this.middlewares.push(middleware);
    }

    listen(port, callback) {
        this.server.listen(port, callback);
    }

    addRouter(router) {
        Object.keys(router.endpoints).forEach(path => {
            const endpoints = router.endpoints[path];
            Object.keys(endpoints).forEach((method) => {
                this.routes.push({
                    path: path,
                    method: method,
                    handler: endpoints[method]
                });
            });
        });
    }

    _createServer() {
        return http.createServer((req, res) => {
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', () => {
                req.body={};
                if (body) {
                    try {
                        req.body = JSON.parse(body);
                    } catch (e) {
                        req.body = body;
                    }
                }

                this._injectResponseMethods(res);
                
                this.middlewares.forEach(middleware => middleware(req, res));

                const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
                const pathname = parsedUrl.pathname;

                try {
                    const route = this.routes.find(r => {
                        return r.method === req.method && this._matchPath(r.path, pathname);
                    });

                    if (route) {
                        this._injectRequestMethods(req, parsedUrl, route.path);
                        Promise.resolve(route.handler(req, res)).catch(err => {
                            console.error(err);
                            res.status(500).json({ message: "Internal Server Error", error: err.message });
                        });
                    } else {
                        res.status(404).json({ message: "Route not found" });
                    }
                } catch (globalError) {
                    console.error(globalError);
                    res.status(500).json({ message: "Critical Server Error" });
                }
            });
        });
    }

    _matchPath(routePath, requestPath) {
        if (routePath === requestPath) return true;
        
        const routeParts = routePath.split('/');
        const requestParts = requestPath.split('/');

        if (routeParts.length !== requestParts.length) return false;

        return routeParts.every((part, i) => {
            return part.startsWith(':') || part === requestParts[i];
        });
    }

    _injectResponseMethods(res) {
        res.send = (data) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        };
        res.json = (data) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        };
        res.status = (code) => {
            res.statusCode = code;
            return res;
        };
    }

    _injectRequestMethods(req, parsedUrl, routePath) {
        const params = {};
        parsedUrl.searchParams.forEach((value, key) => params[key] = value);
        req.query = params;

        req.params = {};
        const routeParts = routePath.split('/');
        const requestParts = parsedUrl.pathname.split('/');

        routeParts.forEach((part, i) => {
            if (part.startsWith(':')) {
                const paramName = part.slice(1);
                req.params[paramName] = requestParts[i];
            }
        });
    }
}