import { queryGenerator } from '../../util/helper';
import Campaign from './campaign.model';

export async function createCampaign(payload: any) {
  return Campaign.create(payload);
}

export async function getCampaign(req: any) {
  return Campaign.find({}, null, queryGenerator(req));
}

export async function deleteCampaign(id: string) {
  return Campaign.findByIdAndDelete(id);
}

export async function updateCampaign({
  id,
  updatedData,
}: {
  id: string;
  updatedData: any;
}) {
  return Campaign.findByIdAndUpdate(id, updatedData, { new: true });
}
