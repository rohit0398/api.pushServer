import { Request } from 'express';
import { queryGenerator } from '../../util/helper';
import Feed from './feed.model';

export async function createFeed(payload: {
  allowRedirectUrl: string;
  blockRedirectUrl: string;
  description: string;
  frequency: string;
  postbackUrl: string;
  title: string;
}) {
  return Feed.create(payload);
}

export async function getFeeds(req: Request) {
  return Feed.find({}, null, queryGenerator(req));
}

export async function deleteFeed(id: string) {
  return Feed.findByIdAndDelete(id);
}

export async function updateFeed({
  feedId,
  updatedData,
}: {
  feedId: string;
  updatedData: any;
}) {
  return Feed.findByIdAndUpdate(feedId, updatedData, { new: true });
}
