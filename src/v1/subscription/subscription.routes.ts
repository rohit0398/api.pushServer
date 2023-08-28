import express from 'express';
import { handleCreateSubscription, handleSendNotificaiton } from './subscription.controller';

const routes = express.Router();

routes.post('/', handleCreateSubscription);
routes.get('/send', handleSendNotificaiton);

module.exports = routes;
