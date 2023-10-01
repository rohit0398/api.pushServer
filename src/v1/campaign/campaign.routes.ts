import { auth } from '@config/auth';
import express from 'express';
import {
  handleCreateCampaign,
  handleDeleteCampaign,
  handleGetCampaign,
  handleUpdateCampaign,
} from './campaign.controller';

const routes = express.Router();

routes.post('/', auth, handleCreateCampaign);
routes.get('/', handleGetCampaign);
routes.delete('/:id', auth, handleDeleteCampaign);
routes.patch('/:id', auth, handleUpdateCampaign);

module.exports = routes;
