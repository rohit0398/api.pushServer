import Subscription from './subscription.model';

export async function createSubscription(payload: any) {
  return Subscription.create(payload);
}
