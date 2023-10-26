import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export default async function handleUpdatePoints(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();
  const { competitionId } = req.body;

  try {
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      select: { grading_system: true }
    });

    if (!competition?.grading_system) {
      return res.status(400).send("Competition or grading system not found");
    }

    const gradingSystemId = competition.grading_system;

    const gradingSystem = await prisma.grading_system.findUnique({
      where: { id: gradingSystemId }
    });

    if (!gradingSystem) {
      return res.status(400).send("Grading system not found");
    }

    const win = parseFloat(gradingSystem.win.toString());
    const draw = parseFloat(gradingSystem.draw.toString());
    const loss = parseFloat(gradingSystem.loss.toString());

    await resetPlayerPoints(prisma, competitionId);

    const results = await prisma.results.findMany({
      where: {
        competition: competitionId,
        NOT: {
          competitor_one_score: null,
          competitor_two_score: null,
        },
      },
    });
    
    for (let result of results) {
        
        let competitorOnePoints;
        let competitorTwoPoints;
      
        const competitorOneScore = parseFloat(result.competitor_one_score.toString());
        const competitorTwoScore = parseFloat(result.competitor_two_score.toString());
      
        console.log(competitorOneScore);
        console.log(competitorTwoScore);
      
        if (competitorOneScore > competitorTwoScore) {
          competitorOnePoints = win;
          competitorTwoPoints = loss;
        } else if (competitorOneScore < competitorTwoScore) {
          competitorOnePoints = loss;
          competitorTwoPoints = win;
        } else {
          competitorOnePoints = draw;
          competitorTwoPoints = draw;
        }

      await updatePlayerPoints(prisma, result.competitor_one, competitorOnePoints, competitionId);
      await updatePlayerPoints(prisma, result.competitor_two, competitorTwoPoints, competitionId);
    }

    res.status(200).send("Points updated successfully");
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).send("Error updating points");
  } finally {
    await prisma.$disconnect();
  }
}

async function updatePlayerPoints(prisma: PrismaClient, playerId: string, pointsToAdd: number, competitionId: string) {
  const playerRecord = await prisma.table_competition.findUnique({
    where: {
      competition_player: {
        competition: competitionId,
        player: playerId
      }
    }
  });

  if (playerRecord) {
    const currentPoints = parseFloat(playerRecord.points.toString());
    await prisma.table_competition.update({
      where: {
        competition_player: {
          competition: competitionId,
          player: playerId
        }
      },
      data: {
        points: currentPoints + pointsToAdd
      }
    });
  }
}

async function resetPlayerPoints(prisma: PrismaClient, competitionId: string) {
  await prisma.table_competition.updateMany({
    where: {
      competition: competitionId
    },
    data: {
      points: 0
    }
  });
}
