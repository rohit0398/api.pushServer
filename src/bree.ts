import dotenv from 'dotenv';
import Bree from 'bree';
import Graceful from '@ladjs/graceful';
// import MongoConnection from './config/mongoConnection';

dotenv.config();
// MongoConnection();
const bree = new Bree({
  jobs: [
    {
      name: 'job',
      interval: '2m',
    },
  ],
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();
