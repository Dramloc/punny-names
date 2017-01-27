const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const winston = require('winston');
const config = require('./config');
const names = require('./names');

// winston
winston.emitErrs = true;
winston.loggers.options = config.winston;
const logger = winston.loggers.get('boot');
const requestLogger = winston.loggers.get('http');
requestLogger.stream.write = (message) => {
  requestLogger.info(message);
};
logger.info('Server process starting');

// express
const app = express();
app.use(helmet());
app.use(compression());
app.use(morgan('dev', { stream: requestLogger.stream }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api/names', names);

app.listen(config.express.port, (error) => {
  if (error) {
    logger.error(`Unable to listen for connections on port ${config.express.port}`, error);
    process.exit(10);
  }
  logger.info(`Listening for connections on port ${config.express.port}`);
});
