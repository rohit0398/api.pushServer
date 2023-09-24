import { Request, Response } from 'express';
import {
  createCampaignAnalytics,
  deleteAnalytics,
  getCampaignAnalytics,
  getSubscribeAnalytics,
  updateAnalytics,
} from './analytics.resources';

export async function handleCreateCampaignAnalytics(
  req: Request,
  res: Response,
) {
  try {
    const feed = await createCampaignAnalytics(req.body);
    res
      .status(200)
      .json({ data: feed, message: 'Campaign Analytics created successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleGetSubscribeAnalytics(req: Request, res: Response) {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

    const numberOfDays = 5;
    const interval = 1;

    const dataPromises = [];
    const dates = [];
    for (let i = 0; i < numberOfDays; i++) {
      const fromDate = new Date(
        currentDate.getTime() - i * interval * 24 * 60 * 60 * 1000,
      );

      dataPromises.push(
        getSubscribeAnalytics({
          fromDate,
          // One day only
          toDate: new Date(fromDate.getTime() + 24 * 60 * 60 * 1000 - 1),
          type: ['ACTIVE', 'UNACTIVE'],
        }),
      );
      dates.push(fromDate.toISOString().substring(0, 10));
    }

    dataPromises.push(
      getSubscribeAnalytics({
        FormData: new Date(currentDate.getTime() - 15 * 24 * 60 * 60 * 1000),
        toDate: new Date(currentDate.getTime() - 0 * 24 * 60 * 60 * 1000),
        type: ['ACTIVE', 'UNACTIVE'],
      }),
    );

    dataPromises.push(
      getSubscribeAnalytics({
        type: ['ACTIVE'],
      }),
    );

    const promises = await Promise.all(dataPromises);
    const data: any = {};
    data.active = promises.pop();
    data.last14days = promises.pop();
    data.dates = [
      {
        name: dates[0],
        subscriptions: (promises[0][1] && promises[0][1].count) ?? 0,
        unsubscriptions: (promises[0][0] && promises[0][0].count) ?? 0,
      },
      {
        name: dates[1],
        subscriptions: (promises[1][1] && promises[1][1].count) ?? 0,
        unsubscriptions: (promises[1][0] && promises[1][0].count) ?? 0,
      },
      {
        name: dates[2],
        subscriptions: (promises[2][1] && promises[2][1].count) ?? 0,
        unsubscriptions: (promises[2][0] && promises[2][0].count) ?? 0,
      },
      {
        name: dates[3],
        subscriptions: (promises[3][1] && promises[3][1].count) ?? 0,
        unsubscriptions: (promises[3][0] && promises[3][0].count) ?? 0,
      },
      {
        name: dates[4],
        subscriptions: (promises[4][1] && promises[4][1].count) ?? 0,
        unsubscriptions: (promises[4][0] && promises[4][0].count) ?? 0,
      },
    ];

    return res
      .status(200)
      .json({ data, message: 'Subscribe Analytics fetched successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleGetCampaignAnalytics(req: Request, res: Response) {
  try {
    const currentTime = new Date();
    const sixHoursAgo = new Date(currentTime.getTime() - 6 * 60 * 60 * 1000); // 6 hours ago
    const interval = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Initialize an array to store time intervals
    const timeIntervals = [];

    // Generate time intervals for the last 6 hours
    for (
      let startTime = sixHoursAgo;
      startTime < currentTime;
      startTime = new Date(startTime.getTime() + interval)
    ) {
      const endTime = new Date(startTime.getTime() + interval);
      timeIntervals.push({ startTime, endTime });
    }

    const dataPromises = [];
    for (const { startTime, endTime } of timeIntervals) {
      dataPromises.push(
        getCampaignAnalytics({
          startTime,
          endTime,
          type: ['SENT', 'CLICKED', 'CLOSED', 'SHOWN'],
        }),
      );
    }

    dataPromises.push(
      getCampaignAnalytics({
        startTime: new Date(currentTime.getTime() - 15 * 24 * 60 * 60 * 1000),
        endTime: new Date(currentTime.getTime() - 0 * 24 * 60 * 60 * 1000),
        type: ['SENT', 'CLICKED', 'CLOSED', 'SHOWN'],
      }),
    );

    const promises = await Promise.all(dataPromises);
    const last14days: any = {};
    const intervals: any = [];
    const last14daysData = promises.pop() ?? [];

    if (Array.isArray(last14daysData)) {
      for (const days of last14daysData) {
        last14days[days._id.toLowerCase()] = days.count;
      }
    }

    promises.forEach((val, ind) => {
      const date = new Date(timeIntervals[ind].endTime as string);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      intervals.push({
        name: `${hours}:${minutes}`,
        ...val.reduce((acc, item) => {
          acc[item._id.toLowerCase()] = item.count;
          return acc;
        }, {}),
      });
    });

    return res.status(200).json({
      data: { last14days, intervals },
      message: 'Campaign Analytics fetched successfully',
    });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleDeleteAnalytics(req: Request, res: Response) {
  try {
    const data = await deleteAnalytics(req?.params?.id);
    return res.status(200).json({ message: 'Analytics deleted successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleUpdateAnalytics(req: Request, res: Response) {
  try {
    const feedId = req.params.id;
    const updatedData = req.body;

    const data = await updateAnalytics({ feedId, updatedData });
    return res.status(200).json({ message: 'Analytics update successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}