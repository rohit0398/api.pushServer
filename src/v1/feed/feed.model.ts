import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    frequency: {
      type: Number,
      required: true,
    },
    postbackUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    allowRedirectUrl: {
      type: String,
    },
    blockRedirectUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

const Feed = mongoose.model('Feed', feedSchema);

export default Feed;
