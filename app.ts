import createError from 'http-errors';
import express, { Express, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/IndexRouter';
import http from 'http';
import { connectToDatabase } from './db/MongooseUtil';
import * as child from 'child_process';
import os from 'os';
import cluster from 'cluster';
import timeout from 'connect-timeout';


const numCpu = os.cpus().length;

require('dotenv').config()

const app: Express = express();

connectToDatabase().then(() => {
  console.log('mongo connected');
});

app.use(timeout(600000));

const startApp = () => {
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'tmp')));

  app.use('', indexRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err: any, req: Request, res: Response, next: any) {
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

  const server = http.createServer(app);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  function normalizePort(val: string) {
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

  function onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

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

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr!.port;
  }
}

// to handle more requests without thread blocking
if (cluster.isPrimary) {
  for(let i = 0; i < numCpu; i++) {
    cluster.fork();
  }

  // we are forking api to avoid blocking thread dedicated for scrapping
  child.fork('./dist/client/app.js');

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died.)`)
  })
} else {
  startApp();
}