import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema(
  {
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
    country: String,
    browser: String,
    deviceType: String,
    type: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'UNACTIVE'],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

const Subscription = mongoose.model('Subscription', pushSubscriptionSchema);

export default Subscription;
