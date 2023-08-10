import express from 'express';
import { handleCreateFeed, handleGetFeeds } from './feed.controller';

const routes = express.Router();

routes.post('/', handleCreateFeed);
routes.get('/', handleGetFeeds);

module.exports = routes;
