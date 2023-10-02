import mongoose from 'mongoose';
import WebPush from 'web-push';
import { random } from 'lodash';
import parentPort from 'worker_threads';
import MongoConnection from '../config/mongoConnection';
import {
  getSubscriptionsCron,
  updateSubscription,
} from '../v1/subscription/subscription.resources';
import { getCampaignCron } from '../v1/campaign/campaign.resources';
import { getCreative } from '../v1/creative/creative.resources';
import { createCampaignAnalytics } from '../v1/analytics/analytics.resources';
import { replaceVariables } from '../util/helper';

console.log('Running crons!');

(async () => {
  if (mongoose.connection.readyState === 0) await MongoConnection();

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

  const creatives = await getCreative({ query: { status: 'ACTIVE' } } as any);

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
    if (Array.isArray(campaign.countries) && campaign.countries.length) {
      searchCriteria.country = {
        $in: campaign.countries.map((value) => new RegExp(value, 'i')),
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
        const {
          _id, feedId, clickId, t1, t2, t3, t4, t5, createdAt,
        } = sub;
        const {
          title, body, icon, image, url, buttonUrl,
        } = choosedCreative;
        const dateString = createdAt;
        const givenDate: any = new Date(dateString);
        const currentDate: any = new Date();
        const timeDifference = currentDate - givenDate;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        const data = {
          campaignId: campaign._id,
          creativeId: choosedCreative._id,
          subscriptionId: _id,
          feedId: feedId ?? '',
          clickId: clickId ?? '',
          t1: t1 ?? '',
          t2: t2 ?? '',
          t3: t3 ?? '',
          t4: t4 ?? '',
          t5: t5 ?? '',
          title,
          body,
          previewImgName: icon,
          bodyImgName: image,
          days,
        };
        const urlUpdate = replaceVariables(url, data);
        choosedCreative.url = urlUpdate;
        if (buttonUrl) {
          const buttonUrlUpdate = replaceVariables(buttonUrl, data);
          choosedCreative.buttonUrl = buttonUrlUpdate;
        }

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

      const operationsPromises: any = [];
      if (sentCount) {
        operationsPromises.push(
          createCampaignAnalytics({
            campaignId: campaign?._id,
            count: sentCount,
            type: 'SENT',
          }),
        );
      }

      if (unactiveIds.length) {
        operationsPromises.push(
          updateSubscription(
            { _id: { $in: unactiveIds } },
            { type: 'UNACTIVE' },
          ),
        );
      }

      await Promise.allSettled(operationsPromises);
    }
  }

  // throw Error("error in code");
  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
