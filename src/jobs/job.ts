import mongoose from 'mongoose';
import MongoConnection from '../config/mongoConnection';
import { getCampaign } from '../v1/campaign/campaign.resources';

console.log('Running crons!');

async function runCampaigns() {
  if (mongoose.connection.readyState === 0) await MongoConnection();
  console.log('mongoose connection', mongoose.connection.readyState);

  const campaigns = await getCampaign({ query: {} });
  console.log('campigns', campaigns);

  mongoose.connection.close();
}
runCampaigns();
