import { auth } from '@config/auth';
import express from 'express';
import {
  handleCreateFeed,
  handleDeleteFeed,
  handleGetFeeds,
  handleUpdateFeed,
} from './feed.controller';

// VAPID keys should be generated only once.
const routes = express.Router();

routes.post('/', auth, handleCreateFeed);
routes.get('/', auth, handleGetFeeds);
routes.delete('/:id', auth, handleDeleteFeed);
routes.patch('/:id', auth, handleUpdateFeed);

module.exports = routes;
