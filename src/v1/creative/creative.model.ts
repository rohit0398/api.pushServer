import mongoose from 'mongoose';

const creativeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: String,
  url: {
    type: String,
    required: true,
  },
  buttonUrl: String,
  buttonTitle: String,
  previewImage: String,
  bodyImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Creative = mongoose.model('Creative', creativeSchema);

export default Creative;
