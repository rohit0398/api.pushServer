import express from 'express';
import {
  handleCreateCampaignAnalytics,
  handleDeleteAnalytics,
  handleGetSubscribeAnalytics,
  handleGetCampaignAnalytics,
  handleUpdateAnalytics,
} from './analytics.controller';

// VAPID keys should be generated only once.
const routes = express.Router();

routes.post('/campaign', handleCreateCampaignAnalytics);

routes.get('/subscribe', handleGetSubscribeAnalytics);
routes.get('/campaign', handleGetCampaignAnalytics);

routes.delete('/:id', handleDeleteAnalytics);
routes.patch('/:id', handleUpdateAnalytics);

module.exports = routes;
