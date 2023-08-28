import Subscription from './subscription.model';
import { queryGenerator } from '../../util/helper';

export async function createSubscription(payload: any) {
  return Subscription.create(payload);
}

export async function getSubscriptions(req: any) {
  return Subscription.find({}, null, queryGenerator(req));
}
