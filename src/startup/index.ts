import express, { Express } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';

export default function startUp(app: Express) {
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
}
