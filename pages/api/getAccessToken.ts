import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

export default async function getAccessToken(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session || !session.accessToken) {
    return res.status(401).send('Unauthorized');
  }
  res.send({ accessToken: session.accessToken });
}
