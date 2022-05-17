import createError from 'http-errors';
import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import userProfileRouter from '../routes/UserProfileRouter';
import http from 'http';
import { connectToDatabase } from '../db/MongooseUtil';

require('dotenv').config();

const app: Express = express();

connectToDatabase().then(() => {
  console.log('mongo connected');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/userProfile', userProfileRouter);

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
  res.json(err.message);
});

const port = normalizePort(process.env.PORT2 || '3001');
console.log(`App is listening on port ${port}`);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);

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
