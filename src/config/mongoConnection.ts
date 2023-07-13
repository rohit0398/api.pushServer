import mongoose from 'mongoose';

export async function MongoConnection() {
  const config: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(process.env.CONNECTION_STRING as string, config);
    console.log('db connected');
  } catch (error) {
    mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
  }
}

export default MongoConnection;
