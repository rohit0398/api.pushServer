import express from 'express';

import {
  handleUserSignIn,
} from './user.controller';

const routes = express.Router();

routes.post('/sign-in', handleUserSignIn);

module.exports = routes;
