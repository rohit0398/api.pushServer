import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema({
  feedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  clickId: String,
  pushSubscription: {
    type: {
      endpoint: {
        type: String,
        required: true,
      },
      expirationTime: Date || null,
      keys: {
        type: {
          p256dh: {
            type: String,
            required: true,
          },
          auth: {
            type: String,
            required: true,
          },
        },
        required: true,
      },
    },
    required: true,
  },
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
