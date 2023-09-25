import mongoose from 'mongoose';
import WebPush from 'web-push';
import { random } from 'lodash';
import {
  getSubscriptionsCron,
  updateSubscription,
} from '../v1/subscription/subscription.resources';
import MongoConnection from '../config/mongoConnection';
import { getCampaignCron } from '../v1/campaign/campaign.resources';
import { getCreative } from '../v1/creative/creative.resources';
import { createCampaignAnalytics } from '../v1/analytics/analytics.resources';

console.log('Running crons!');

export default async function runCampaigns() {
  if (mongoose.connection.readyState === 0) await MongoConnection();
  console.log('sub run');
  console.log('mongoose connection', mongoose.connection.readyState);

  const vapidKeys = {
    publicKey:
      'BL4CN0bTsLEAUoC4WV1xcNAYj33T1F58PgeJgEUO0n_TQn1qpKG1oa7bfmhizBG1ei3tD_jka35c6HhBmw4Mkms',
    privateKey: 'mk1uGAGwgg4DKmZfTXG6u45t5LlBj7zglQl3cdgJEmw',
  };

  WebPush.setVapidDetails(
    'https://api-pushserver.onrender.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey,
  );

  // Get the current date and time
  const currentDate = new Date();
  // Get the current day of the week as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDayNumber = currentDate.getDay();
  // Define an array of day names
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  // Get the current day name
  const currentDayName = dayNames[currentDayNumber];
  // Get the current hour (0-23)
  const currentHour = currentDate.getHours();

  const campaigns = await getCampaignCron(
    {
      $and: [
        { status: 'ACTIVE' },
        {
          $or: [
            { hours: { $size: 0 } }, // Include if "hours" is empty
            { hours: currentHour }, // Match specific hour if provided
          ],
        },
        {
          $or: [
            { days: { $size: 0 } }, // Include if "days" is empty
            { days: currentDayName }, // Match specific day if provided (case-insensitive)
          ],
        },
      ],
    },
    { query: {} },
  );

  const creatives = await getCreative({ query: {} } as any);

  for (const campaign of campaigns) {
    // Convert the filter criteria to lowercase for case-insensitive matching
    const searchCriteria: any = {};
    if (Array.isArray(campaign.feeds) && campaign.feeds.length) {
      searchCriteria.feedId = {
        $in: campaign.feeds.map(
          (feedId) => new mongoose.Types.ObjectId(feedId),
        ),
      };
    }
    if (Array.isArray(campaign.languages) && campaign.languages.length) {
      searchCriteria.lang = {
        $in: campaign.languages.map((value) => new RegExp(value, 'i')),
      };
    }
    if (Array.isArray(campaign.os) && campaign.os.length) {
      searchCriteria.os = {
        $in: campaign.os.map((value) => new RegExp(value, 'i')),
      };
    }
    if (Array.isArray(campaign.devices) && campaign.devices.length) {
      searchCriteria.deviceType = {
        $in: campaign.devices.map((value) => new RegExp(value, 'i')),
      };
    }
    if (Array.isArray(campaign.browsers) && campaign.browsers.length) {
      searchCriteria.browser = {
        $in: campaign.browsers.map((value) => new RegExp(value, 'i')),
      };
    }

    const createdAt: any = {};
    const now: any = new Date();
    if (campaign?.subscriptionFrom) {
      createdAt.$lt = new Date(
        now - campaign?.subscriptionFrom * 60 * 60 * 1000,
      );
    }

    if (
      campaign?.subscriptionTo
      && campaign?.subscriptionTo > ((campaign?.subscriptionFrom as number) ?? 0)
    ) {
      createdAt.$gte = new Date(
        now - campaign?.subscriptionTo * 60 * 60 * 1000,
      );
    }
    if (Object.keys(createdAt).length) searchCriteria.createdAt = createdAt;

    searchCriteria.type = 'ACTIVE';

    const subscriptions = await getSubscriptionsCron(searchCriteria, {
      query: {},
    });

    if (Array.isArray(subscriptions) && subscriptions.length) {
      let findCreatives = creatives.filter((val) => campaign?._id.equals(val?.campaignId));

      if (findCreatives.length === 0) findCreatives = creatives;
      const choosedCreative = findCreatives[random(0, findCreatives.length - 1)];

      const promises: any = [];
      for (const sub of subscriptions) {
        promises.push(
          WebPush.sendNotification(
            sub.pushSubscription,
            JSON.stringify(choosedCreative),
          ),
        );
      }

      const res = await Promise.allSettled(promises);

      const unactiveIds: any = [];
      let sentCount = 0;

      res.forEach((val, ind) => {
        if (val.status === 'fulfilled') sentCount += 1;
        else if (val.status === 'rejected') unactiveIds.push(subscriptions[ind]._id);
      });
      if (sentCount) {
        createCampaignAnalytics({
          campaignId: campaign?._id,
          count: sentCount,
          type: 'SENT',
        });
      }

      if (unactiveIds.length) {
        updateSubscription({ _id: { $in: unactiveIds } }, { type: 'UNACTIVE' });
      }
      console.log('hello', res);
    }
  }

  console.log('campigns', campaigns);
  // mongoose.connection.close();
}

runCampaigns();
