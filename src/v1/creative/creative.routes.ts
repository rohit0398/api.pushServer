import express from 'express';
import multer from 'multer';

import {
  handleCreateCreative,
  handleDeleteCreative,
  handleGetCreative,
  handleUpdateCreative,
} from './creative.controller';

const upload = multer();
const routes = express.Router();

routes.post(
  '/',
  upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  handleCreateCreative,
);
routes.get('/', handleGetCreative);
routes.delete('/:id', handleDeleteCreative);
routes.patch('/:id', handleUpdateCreative);

module.exports = routes;
