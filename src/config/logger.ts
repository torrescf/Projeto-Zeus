import winston from 'winston';
import { Loggly } from 'winston-loggly-bulk';

if (!process.env.LOGGLY_TOKEN || !process.env.LOGGLY_SUBDOMAIN) {
  throw new Error('LOGGLY_TOKEN and LOGGLY_SUBDOMAIN must be defined in the environment variables');
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new Loggly({
      token: process.env.LOGGLY_TOKEN,
      subdomain: process.env.LOGGLY_SUBDOMAIN,
      tags: ['ZeusAPI'],
      json: true,
    }),
  ],
});

export default logger;
