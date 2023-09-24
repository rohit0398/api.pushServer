import mongoose from 'mongoose';

const campaignAnalyticsSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['SENT', 'CLICKED', 'CLOSED', 'SHOWN'],
    },
    count: {
      type: Number,
      default: 1, // Initialize count to 1 when a new event is created
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

const CampaignAnalytics = mongoose.model(
  'CampaignAnalytics',
  campaignAnalyticsSchema,
);

export default CampaignAnalytics;
