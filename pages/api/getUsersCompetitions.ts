import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const userOwner = await prisma.user_owner.findUnique({
      where: {
        email: email as string,
      },
    });

    if (!userOwner) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userCompetitions = await prisma.competition.findMany({
      where: {
        owner: userOwner.id,
      },
    });

    res.json(userCompetitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching competitions.' });
  }
}
