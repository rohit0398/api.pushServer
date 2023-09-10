import MongoConnection from "../config/mongoConnection";
import mongoose from "mongoose";
import { getCampaign } from "../v1/campaign/campaign.resources";

console.log("Running crons!");

async function runCampaigns() {
  await MongoConnection();
  console.log("mongoose connection", mongoose.connection.readyState);

  const campaigns = await getCampaign({ query: {} });
  console.log("campigns", campaigns);

  mongoose.connection.close();
}
runCampaigns();
