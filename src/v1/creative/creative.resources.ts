import { Request } from 'express';

import { queryGenerator } from '../../util/helper';
import Creative from './creative.model';

export async function createCreative(payload: any) {
  return Creative.create(payload);
}

export async function getCreative(req: Request) {
  const { campaignId } = req.query;
  const query: any = {};
  if (campaignId) query.campaignId = campaignId;
  return Creative.find(query, null, queryGenerator(req));
}

export async function deleteCreative(id: string) {
  return Creative.findByIdAndDelete(id);
}

export async function updateCreative({
  id,
  updatedData,
}: {
  id: string;
  updatedData: any;
}) {
  return Creative.findByIdAndUpdate(id, updatedData, { new: true });
}
