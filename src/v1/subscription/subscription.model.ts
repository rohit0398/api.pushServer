import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema({
  feedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  clickId: String,
  t1: String,
  t2: String,
  t3: String,
  t4: String,
  t5: String,
  lang: String,
  os: String,
  timezone: String,
  browser: String,
  deviceType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Subscription = mongoose.model('Subscription', pushSubscriptionSchema);

export default Subscription;
