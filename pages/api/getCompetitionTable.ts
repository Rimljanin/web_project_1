import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const tableEntries = await prisma.table_competition.findMany({
      where: { competition: id as string },
      include: {
        player_table_competition_playerToplayer: true,
        competition_table_competition_competitionTocompetition: true
      },
      orderBy: { points: 'desc' }
    });

    const competitionName = tableEntries[0]?.competition_table_competition_competitionTocompetition.name;

    const tableData = tableEntries.map(entry => ({
      playerId: entry.player,
      playerName: entry.player_table_competition_playerToplayer.name,
      points: entry.points
    }));

    res.status(200).json({ tableData, competitionName });
  } catch (error) {
    console.error("Failed to fetch competition table:", error);
    res.status(500).json({ error: "Failed to fetch competition table." });
  }
}

