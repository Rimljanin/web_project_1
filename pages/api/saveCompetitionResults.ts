import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

const saveCompetitionResults = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const results = req.body;

  if (!Array.isArray(results)) {
    return res.status(400).json({ error: 'Payload should be an array of results' });
  }

  try {
    const updatedResults = [];

    for (const result of results) {
      const updatedResult = await prisma.results.update({
        where: { id: result.id },
        data: {
          competitor_one_score: result.competitor_one_score,
          competitor_two_score: result.competitor_two_score,
        },
      });
      updatedResults.push(updatedResult);
    }

    return res.status(200).json(updatedResults);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save competition results' });
  }
};

export default saveCompetitionResults;
