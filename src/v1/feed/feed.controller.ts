import { Request, Response } from 'express';
import { createFeed, getFeeds } from './feed.resources';

export async function handleCreateFeed(req: Request, res: Response) {
  try {
    await createFeed(req.body);
    res.status(200).json({ message: 'Feed created successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleGetFeeds(req: Request, res: Response) {
  try {
    const data = await getFeeds(req);
    return res.status(200).json({ data, message: 'Feed fetched successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}
