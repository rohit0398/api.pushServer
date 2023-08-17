import mongoose from 'mongoose';
import Feed from '../v1/feed/feed.model';
import Subscription from '../v1/subscription/subscription.model';

export async function MongoConnection() {
  const config: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(process.env.CONNECTION_STRING as string, config);
    console.log('db connected');

    Feed.createCollection().then(() => {
      console.log('Feed is created!');
    });

    Subscription.createCollection().then(() => {
      console.log('Feed is created!');
    });
  } catch (error) {
    mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
  }
}

export default MongoConnection;
