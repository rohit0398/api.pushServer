import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  feeds: {
    type: [String], // Array of strings
  },
  creative: {
    type: [String],
  },
  languages: {
    type: [String],
  },
  countries: {
    type: [String], // Array of strings
  },
  browsers: {
    type: [String],
  },
  devices: {
    type: [String],
  },
  os: {
    type: [String], // Array of strings
  },
  subscriptionFrom: {
    type: Number,
  },
  subscriptionTo: {
    type: Number,
  },
  frequency: {
    type: Number,
  },
  random: {
    type: Number,
  },
  days: {
    type: [String], // An object representing days with boolean values
  },
  hours: {
    type: [String], // An object representing hours with boolean values
  },
  status: {
    type: String,
    default: 'PAUSED',
    enum: ['ACTIVE', 'PAUSED'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
