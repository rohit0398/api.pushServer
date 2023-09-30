import { Request } from 'express';
import { queryGenerator } from '../../util/helper';
import CampaignAnalytics from './campaignAnalytics.model';
import Subscription from '../subscription/subscription.model';

export async function createCampaignAnalytics(payload: any) {
  return CampaignAnalytics.create(payload);
}

export async function getSubscribeAnalytics(query: { [key: string]: any }) {
  const match: any = {};
  if (query?.fromDate) {
    match.createdAt = {
      $gte: query.fromDate,
      $lte: query.toDate,
    };
  }
  if (query?.type) match.type = { $in: query.type };
  if (query?.feedId) match.feedId = query.feedId;

  return Subscription.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: '$type', // Group by event type
        count: { $sum: 1 }, // Count events within the specified time interval
      },
    },
  ]);
}

export async function getCampaignAnalytics(query: { [key: string]: any }) {
  const match: any = {};
  if (query?.startTime) {
    match.createdAt = {
      $gte: query.startTime,
      $lte: query.endTime,
    };
  }
  if (query?.type) match.type = { $in: query.type };

  return CampaignAnalytics.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: '$type', // Group by event type
        count: { $sum: '$count' }, // Count events within the specified time interval
      },
    },
  ]);
}

export async function deleteAnalytics(id: string) {
  return CampaignAnalytics.findByIdAndDelete(id);
}

export async function updateAnalytics({
  feedId,
  updatedData,
}: {
  feedId: string;
  updatedData: any;
}) {
  return CampaignAnalytics.findByIdAndUpdate(feedId, updatedData, {
    new: true,
  });
}
