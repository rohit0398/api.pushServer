import { auth } from '@config/auth';
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
  auth,
  upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  handleCreateCreative,
);
routes.get('/', auth, handleGetCreative);
routes.delete('/:id', auth, handleDeleteCreative);
routes.patch(
  '/:id',
  auth,
  upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  handleUpdateCreative,
);

module.exports = routes;
