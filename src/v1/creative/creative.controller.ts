import { Request, Response } from 'express';
import {
  createCreative,
  deleteCreative,
  getCreative,
  updateCreative,
} from './creative.resources';

export async function handleCreateCreative(req: Request, res: Response) {
  try {
    const creative = await createCreative(req.body);
    res
      .status(200)
      .json({ data: creative, message: 'Creative created successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleGetCreative(req: Request, res: Response) {
  try {
    const creative = await getCreative(req);
    res
      .status(200)
      .json({ data: creative, message: 'Creative fetched successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleDeleteCreative(req: Request, res: Response) {
  try {
    const data = await deleteCreative(req?.params?.id);
    return res.status(200).json({ message: 'Creative deleted successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleUpdateCreative(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const data = await updateCreative({ id, updatedData });
    return res.status(200).json({ data, message: 'Creative updated successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}
