import { Request, Response } from 'express';
import axios from 'axios';
import { createSubscription } from './subscription.resources';
import { TimezoneCountry } from '../../util/consts';

export const vapidKeys = {
  publicKey:
    'BL4CN0bTsLEAUoC4WV1xcNAYj33T1F58PgeJgEUO0n_TQn1qpKG1oa7bfmhizBG1ei3tD_jka35c6HhBmw4Mkms',
  privateKey: 'mk1uGAGwgg4DKmZfTXG6u45t5LlBj7zglQl3cdgJEmw',
};

export async function handleCreateSubscription(req: Request, res: Response) {
  try {
    const { body } = req;
    if (body?.timezone) {
      body.country = TimezoneCountry[body?.timezone?.toLowerCase() as string];
    }
    const promises: any = [];
    promises.push(createSubscription(body));

    // hitting postback url if exists
    const { postbackUrl, clickId }: any = body ?? {};
    if (postbackUrl && clickId) {
      const url = postbackUrl.replace('{clickId}', clickId);
      promises.push(axios.get(url));
    }
    await Promise.allSettled(promises);

    res.status(200).json({ message: 'Subscription created successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleSendNotificaiton(req: Request, res: Response) {
  try {
    console.log('subsc run');
    // runCampaigns();
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}
