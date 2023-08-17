import express from 'express';
import { handleCreateSubscription } from './subscription.controller';

const routes = express.Router();

routes.post('/', handleCreateSubscription);

module.exports = routes;
