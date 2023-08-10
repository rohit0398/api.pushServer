import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema({
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
  createdAt: Date,
  updatedAt: Date,
});

const Feed = mongoose.model('Feed', feedSchema);

export default Feed;
