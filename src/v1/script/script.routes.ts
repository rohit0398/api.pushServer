import express from 'express';
import { handlePushNotificationScript, handleScriptBuild } from './script.controller';

const routes = express.Router();

routes.get('/push-notification-script.js', handlePushNotificationScript);
routes.get('/build', handleScriptBuild);

module.exports = routes;
