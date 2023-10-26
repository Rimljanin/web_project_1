import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; 

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Competition ID is required' });
  }

  try {
    const competition = await prisma.competition.findUnique({
      where: {
        id: id as string,
      },
      include: {
        grading_system_competition_grading_systemTograding_system: true
      }
    });

    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    const gradingSystem = competition.grading_system_competition_grading_systemTograding_system;

    return res.status(200).json(gradingSystem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch competition grading system' });
  }
};
