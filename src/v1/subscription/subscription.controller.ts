import { Request, Response } from 'express';
import { createSubscription } from './subscription.resources';

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
