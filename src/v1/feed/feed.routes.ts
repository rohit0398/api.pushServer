import express from 'express';
import {
  handleCreateFeed, handleDeleteFeed, handleGetFeeds, handleUpdateFeed,
} from './feed.controller';

// VAPID keys should be generated only once.
const routes = express.Router();

routes.post('/', handleCreateFeed);
routes.get('/', handleGetFeeds);
routes.delete('/:id', handleDeleteFeed);
routes.patch('/:id', handleUpdateFeed);

module.exports = routes;
