import mongoose from 'mongoose';

export async function MongoConnection() {
  const config: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    console.log('mongoose connection', mongoose.connection.readyState);
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.CONNECTION_STRING as string, config);
    }
    console.log('db connected');
    console.log('mongoose connection', mongoose.connection.readyState);
  } catch (error) {
    mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
  }
}

export default MongoConnection;
