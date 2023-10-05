import Bree from 'bree';
import Graceful from '@ladjs/graceful';

const bree = new Bree({
  worker: {
    env: {
      CONNECTION_STRING:
        'mongodb://accountAdmin01:0Fpejk7v7PT+@127.0.0.1:27017/pushserver?directConnection=true&serverSelectionTimeoutMS=8000',
      API_URL: 'https://api.vibesender.com',
      JWT_STRING: 'pushServer#234',
    },
  },
  jobs: [
    {
      name: 'job',
      interval: '30m',
    },
  ],
  errorHandler: (error, workerMetadata) => {
    // workerMetadata will be populated with extended worker information only if
    // Bree instance is initialized with parameter `workerMetadata: true`
    if (workerMetadata.threadId) {
      console.log(
        `There was an error while running a worker ${workerMetadata.name} with thread ID: ${workerMetadata.threadId}`,
      );
    } else {
      console.log(
        `There was an error while running a worker ${workerMetadata.name}`,
      );
    }
  },
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();

export default bree;
