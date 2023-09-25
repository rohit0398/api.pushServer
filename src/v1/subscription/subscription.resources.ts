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
  return Subscription.find(findQuery, null, queryGenerator(pagingQuery));
}

export async function updateSubscription(filter: any, update: any) {
  return Subscription.updateMany(filter, update);
}
