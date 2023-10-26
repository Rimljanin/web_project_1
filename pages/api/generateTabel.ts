import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { competitionId } = req.body;

    try {
      const participants = await prisma.player.findMany({
        where: { competition: competitionId }
      });      

      
      if (participants.length === 0) {
        res.status(400).json({ error: "No players found for the given competitionId." });
        return;
      }

      
      for (let participant of participants) {
        await prisma.table_competition.create({
          data: {
            id: uuid(),
            competition: competitionId,
            player: participant.id,
            points: 0
          }
        });
      }

      res.status(200).json({ message: 'Table generated successfully.' });
    } catch (error) {
      console.error("Failed to generate the table:", error);
      res.status(500).json({ error: "Failed to generate the table." });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}

