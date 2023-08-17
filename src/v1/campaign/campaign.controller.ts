import { Request, Response } from 'express';
import {
  createCampaign,
  deleteCampaign,
  getCampaign,
  updateCampaign,
} from './campaign.resources';

export async function handleCreateCampaign(req: Request, res: Response) {
  try {
    const campaign = await createCampaign(req.body);
    res
      .status(200)
      .json({ data: campaign, message: 'Campaign created successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleGetCampaign(req: Request, res: Response) {
  try {
    const campaign = await getCampaign(req);
    res
      .status(200)
      .json({ data: campaign, message: 'Campaign fetched successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleDeleteCampaign(req: Request, res: Response) {
  try {
    await deleteCampaign(req?.params?.id);
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleUpdateCampaign(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const campaign = await updateCampaign({ id, updatedData });
    res
      .status(200)
      .json({ data: campaign, message: 'Campaign updated successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}
