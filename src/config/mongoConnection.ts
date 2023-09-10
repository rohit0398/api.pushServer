import mongoose from "mongoose";
import Feed from "../v1/feed/feed.model";
import Subscription from "../v1/subscription/subscription.model";

export async function MongoConnection() {
  const config: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    console.log("mongoose connection", mongoose.connection.readyState);
    await mongoose.connect(process.env.CONNECTION_STRING as string ?? 'mongodb+srv://rkkb7828131:ZGElfyRyDY75KOA0@cluster0.bnasbhp.mongodb.net/?retryWrites=true&w=majority', config);
    console.log("db connected");
    console.log("mongoose connection", mongoose.connection.readyState);

    Feed.createCollection().then(() => {
      console.log("Feed is created!");
    });

    Subscription.createCollection().then(() => {
      console.log("Feed is created!");
    });
  } catch (error) {
    mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.error("Unable to connect to the database:", error);
  }
}

export default MongoConnection;
