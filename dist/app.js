"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const IndexRouter_1 = __importDefault(require("./routes/IndexRouter"));
const http_1 = __importDefault(require("http"));
const MongooseUtil_1 = require("./db/MongooseUtil");
const child = __importStar(require("child_process"));
const os_1 = __importDefault(require("os"));
const cluster_1 = __importDefault(require("cluster"));
const PuppeteerCluster_1 = require("./util/PuppeteerCluster");
const numCpu = os_1.default.cpus().length;
require('dotenv').config();
const app = (0, express_1.default)();
(0, MongooseUtil_1.connectToDatabase)().then(() => {
    console.log('mongo connected');
});
const startApp = async () => {
    (0, PuppeteerCluster_1.init)().then(() => {
        console.log('puppeteer cluster started');
    });
    app.use((0, morgan_1.default)('dev'));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.static(path_1.default.join(__dirname, 'tmp')));
    app.use('', IndexRouter_1.default);
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next((0, http_errors_1.default)(404));
    });
    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.status(err.status || 500);
        res.json('error');
    });
    const port = normalizePort(process.env.PORT1 || '3000');
    console.log(`App is listening on port ${port}`);
    app.set('port', port);
    /**
     * Create HTTP server.
     */
    const server = http_1.default.createServer(app);
    server.listen(port);
    server.on('error', onError);
    function normalizePort(val) {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
            // named pipe
            return val;
        }
        if (port >= 0) {
            // port number
            return port;
        }
        return false;
    }
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
};
// to handle more requests without thread blocking
if (cluster_1.default.isPrimary) {
    for (let i = 0; i < numCpu; i++) {
        cluster_1.default.fork();
    }
    // we are forking api to avoid blocking thread dedicated for scrapping
    child.fork('./dist/client/app.js');
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died.)`);
    });
}
else {
    startApp();
}
//# sourceMappingURL=app.js.map