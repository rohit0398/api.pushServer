import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getSubscribeAnalytics } from '../analytics/analytics.resources';
import {
  createFeed, deleteFeed, getFeeds, updateFeed,
} from './feed.resources';

export async function handleCreateFeed(req: Request, res: Response) {
  try {
    const feed = await createFeed(req.body);
    res.status(200).json({ data: feed, message: 'Feed created successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleGetFeeds(req: Request, res: Response) {
  try {
    let data: any = await getFeeds(req);

    const dataPromises: any = [];
    if (Array.isArray(data)) {
      data = JSON.parse(JSON.stringify(data));
      for (const feed of data) {
        dataPromises.push(
          getSubscribeAnalytics({
            type: ['ACTIVE'],
            feedId: new mongoose.Types.ObjectId(feed._id),
          }),
        );
      }
      const promises = await Promise.all(dataPromises);
      data = data.map((val, ind) => {
        let count = 0;
        if (promises[ind] && promises[ind][0]) count = promises[ind][0]?.count ?? 0;
        return { ...val, count };
      });
    }

    return res.status(200).json({ data, message: 'Feed fetched successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleDeleteFeed(req: Request, res: Response) {
  try {
    const data = await deleteFeed(req?.params?.id);
    return res.status(200).json({ message: 'Feed deleted successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleUpdateFeed(req: Request, res: Response) {
  try {
    const feedId = req.params.id;
    const updatedData = req.body;

    const data = await updateFeed({ feedId, updatedData });
    return res.status(200).json({ message: 'Feed update successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}
