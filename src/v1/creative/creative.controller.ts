import { Request, Response } from 'express';
import fs from 'fs/promises';

import {
  createCreative,
  deleteCreative,
  getCreative,
  updateCreative,
} from './creative.resources';

let dirname: any = __dirname;
// eslint-disable-next-line prefer-destructuring
const dist = dirname.split('dist');
const src = dirname.split('src');

console.log('abdsf', dist, src);
if (Array.isArray(dist) && dist.length === 2) dirname = dist[0];
else dirname = src[0];

export async function handleCreateCreative(req: Request, res: Response) {
  try {
    const { body, files } = req;
    const icon = files.icon[0] as any;
    const image = files.image[0] as any;

    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const iconName = `${body.campaignId}-${uniquePrefix}-${icon?.originalname}`;
    const imageName = `${body.campaignId}-${uniquePrefix}-${image?.originalname}`;

    console.log('dirname', dirname, `${dirname}public/icons/${iconName}`);
    await fs.writeFile(
      `${dirname}public/icons/${iconName}`,
      icon?.buffer as any,
    );
    await fs.writeFile(
      `${dirname}public/images/${imageName}`,
      image?.buffer as any,
    );
    body.icon = `/icons/${iconName}`;
    body.image = `/images/${imageName}`;

    const creative = await createCreative(body);
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
    await fs.unlink(`${dirname}public${data?.image}`);
    await fs.unlink(`${dirname}public${data?.icon}`);
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
    return res
      .status(200)
      .json({ data, message: 'Creative updated successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}
