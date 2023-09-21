import { Request, Response } from 'express';
import WebPush from 'web-push';
import runCampaigns from '../../jobs/job';
import { getCreative } from '../creative/creative.resources';
import { createSubscription, getSubscriptions } from './subscription.resources';

export const vapidKeys = {
  publicKey:
    'BL4CN0bTsLEAUoC4WV1xcNAYj33T1F58PgeJgEUO0n_TQn1qpKG1oa7bfmhizBG1ei3tD_jka35c6HhBmw4Mkms',
  privateKey: 'mk1uGAGwgg4DKmZfTXG6u45t5LlBj7zglQl3cdgJEmw',
};

export async function handleCreateSubscription(req: Request, res: Response) {
  try {
    await createSubscription(req.body);
    res.status(200).json({ message: 'Subscription created successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleSendNotificaiton(req: Request, res: Response) {
  try {
    // const lastSub = await getSubscriptions(req);
    // const lastCreative = await getCreative({ query: { limit: '1' } } as any);
    // console.log('las', lastCreative, lastSub);
    // WebPush.setVapidDetails(
    //   'https://api-pushserver.onrender.com',
    //   vapidKeys.publicKey,
    //   vapidKeys.privateKey,
    // );

    // console.log('las', process.env.API_URL);

    // if (Array.isArray(lastSub) && Array.isArray(lastCreative)) {
    //   for (const sub of lastSub) {
    //     if (sub?.pushSubscription) {
    //       WebPush.sendNotification(
    //         sub.pushSubscription,
    //         JSON.stringify(lastCreative[0]),
    //       );
    //     }
    //   }
    // }
    console.log('subsc run');
    runCampaigns();
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}
