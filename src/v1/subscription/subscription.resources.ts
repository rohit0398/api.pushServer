import mongoose from 'mongoose';
import Subscription from './subscription.model';
import { queryGenerator } from '../../util/helper';

export async function createSubscription(payload: any) {
  return Subscription.create(payload);
}

export async function getSubscriptions(req: any) {
  return Subscription.find({}, null, queryGenerator(req));
}

export async function getSubscriptionsCron(findQuery: any, pagingQuery: any) {
  mongoose.set('debug', true);
  return Subscription.find(findQuery, null, queryGenerator(pagingQuery));
}
