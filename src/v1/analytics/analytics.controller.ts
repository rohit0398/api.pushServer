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
    const datesInterval: any = [];
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
      datesInterval.push(fromDate.toISOString().substring(0, 10));
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
    const last14daysData = promises.pop();
    const last14days: any = {};
    const dates: any = [];
    if (Array.isArray(last14daysData)) {
      for (const days of last14daysData) {
        last14days[
          days._id === 'ACTIVE' ? 'subscriptions' : 'unsubscriptions'
        ] = days.count;
      }
    }
    data.last14days = last14days;

    promises.forEach((val, ind) => {
      dates.push({
        name: datesInterval[ind],
        ...val.reduce((acc, item) => {
          acc[item._id === 'ACTIVE' ? 'subscriptions' : 'unsubscriptions'] = item.count;
          return acc;
        }, {}),
      });
    });

    data.dates = dates;

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

    // Define the interval in minutes
    const intervalMinutes = 30; // 30 minutes

    // Initialize an array to store time intervals
    const timeIntervals = [];

    // Calculate the first interval start time
    let startTime = new Date(sixHoursAgo);
    startTime.setMinutes(intervalMinutes); // Set the start minute

    // Generate time intervals for the last 6 hours
    while (startTime < currentTime) {
      const endTime = new Date(
        startTime.getTime() + intervalMinutes * 60 * 1000,
      ); // Calculate end time
      timeIntervals.push({ startTime, endTime });
      startTime = new Date(endTime); // Move to the next interval start time
    }

    const dataPromises = [];
    for (const { startTime, endTime } of timeIntervals) {
      dataPromises.push(
        getCampaignAnalytics({
          startTime,
          endTime,
          type: [
            'SENT',
            'CLICKED',
            //  'CLOSED', 'SHOWN'
          ],
        }),
      );
    }

    dataPromises.push(
      getCampaignAnalytics({
        startTime: new Date(currentTime.getTime() - 15 * 24 * 60 * 60 * 1000),
        endTime: new Date(currentTime.getTime() - 0 * 24 * 60 * 60 * 1000),
        type: [
          'SENT',
          'CLICKED',
          // "CLOSED", "SHOWN"
        ],
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
