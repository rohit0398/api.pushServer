import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { findUser } from './user.resources';

export async function handleUserSignIn(req: Request, res: Response) {
  try {
    const query: any = await findUser(req.body);
    if (!query?._id) {
      return res.status(400).json({
        message: "Email does't exist",
      });
    }

    const comparePasswrod = bcrypt.compareSync(
      req.body.password,
      query.password,
    );

    if (!comparePasswrod) {
      return res.status(400).json({
        message: "Email/Password does't match",
      });
    }

    const token = jwt.sign({ _id: query._id }, process.env.JWT_STRING as string, {
      expiresIn: '30d',
    });

    return res.status(200).json({
      message: 'Sign in successfull',
      data: { _id: query._id, token },
    });
  } catch (ex: any) {
    return res.status(500).json({
      message: ex?.message ?? 'Something went wrong! try again later',
    });
  }
}
