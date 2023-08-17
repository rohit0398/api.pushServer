import express from 'express';
import {
  handleCreateCreative,
  handleDeleteCreative,
  handleGetCreative,
  handleUpdateCreative,
} from './creative.controller';

const routes = express.Router();

routes.post('/', handleCreateCreative);
routes.get('/', handleGetCreative);
routes.delete('/:id', handleDeleteCreative);
routes.patch('/:id', handleUpdateCreative);

module.exports = routes;
