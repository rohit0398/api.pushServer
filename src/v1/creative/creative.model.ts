import mongoose from 'mongoose';

const creativeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    campaignId: { type: String, required: true },
    url: {
      type: String,
      required: true,
    },
    body: String,
    buttonUrl: String,
    buttonTitle: String,
    icon: { type: String, get: obfuscate },
    image: { type: String, get: obfuscate },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { toJSON: { getters: true } },
);

// Mongoose passes the raw value in MongoDB `email` to the getter
function obfuscate(path: string) {
  return process.env.API_URL + path;
}

const Creative = mongoose.model('Creative', creativeSchema);

export default Creative;
