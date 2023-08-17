import express from 'express';
import {
  handleCreateCampaign, handleDeleteCampaign, handleGetCampaign, handleUpdateCampaign,
} from './campaign.controller';

const routes = express.Router();

routes.post('/', handleCreateCampaign);
routes.get('/', handleGetCampaign);
routes.delete('/:id', handleDeleteCampaign);
routes.patch('/:id', handleUpdateCampaign);

module.exports = routes;
