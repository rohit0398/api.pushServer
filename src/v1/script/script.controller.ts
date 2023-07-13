import { transformFileSync, BabelFileResult } from '@babel/core';
import { Request, Response } from 'express';

const webpackCli = require('webpack-cli');

export async function handlePushNotificationScript(
  req: Request,
  res: Response,
) {
  try {
    const dir = __dirname;
    const rootDir = dir.split('\\src\\');
    const transformedCode = transformFileSync(
      `${rootDir[0]}\\public\\scripts\\pushNotificationScript.js`,
      {
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      },
    )?.code;

    res.set('Content-Type', 'text/javascript');
    res.send(transformedCode);
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

export async function handleScriptBuild(req: Request, res: Response) {
  try {
    runWebpack()
      .then(() => {
        res.json({ message: 'Build process completed successfully' });
      })
      .catch(() => {
        res.status(500).json({ error: 'Build process failed' });
      });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}

async function runWebpack() {
  const cli = new webpackCli();
  await cli.run(['--config', 'webpack.config.js']);
}
