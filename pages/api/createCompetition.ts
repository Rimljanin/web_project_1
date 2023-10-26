import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';  
import { v4 as uuid } from 'uuid';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { email, name, competitionName, participants, winPoints, drawPoints, lossPoints } = req.body;

  function generateRoundRobin(players: string[]): string[][][] {
    if (players.length % 2 !== 0) {
        players.push("DUMMY");
    }

    const numRounds = players.length - 1;
    const halfSize = players.length / 2;
    const rounds: string[][][] = [];

    for (let round = 0; round < numRounds; round++) {
        const currentRound: string[][] = [];
        for (let i = 0; i < halfSize; i++) {
            const player1 = players[i];
            const player2 = players[players.length - 1 - i];
            currentRound.push([player1, player2]);
        }
        rounds.push(currentRound);

        const firstPlayer = players.shift()!;
        const lastPlayer = players.pop()!;
        players.unshift(lastPlayer);
        players.unshift(firstPlayer);
    }

    if (players.includes("DUMMY")) {
        players.pop();
        for (const round of rounds) {
            for (let i = round.length - 1; i >= 0; i--) {
                if (round[i].includes("DUMMY")) {
                    round.splice(i, 1);
                }
            }
        }
    }

    return rounds;
}


  try {
    let user = await prisma.user_owner.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      user = await prisma.user_owner.create({
        data: {
          id: uuid(),
          email: email,
          name: name,
        },
      });
    }
    const grading = await prisma.grading_system.create({
      data: {
        id: uuid(),
        win: parseFloat(winPoints),
        draw: parseFloat(drawPoints),
        loss: parseFloat(lossPoints),
      },
    });

    const competition = await prisma.competition.create({
      data: {
        id: uuid(),
        owner: user.id,
        grading_system: grading.id,
        name: competitionName,
      },
    });

    for (const participant of participants) {
      await prisma.player.create({
        data: {
          id: uuid(),
          name: participant,
          competition: competition.id,
        },
      });
    }

  

const schedule = generateRoundRobin(participants);
let roundNumber = 1;
for (const round of schedule) {
    for (const match of round) {
      const player1 = await prisma.player.findFirst({ where: { name: match[0], competition: competition.id } });
      const player2 = await prisma.player.findFirst({ where: { name: match[1], competition: competition.id } });
      
      if (!player1 || !player2) {
          throw new Error("One of the players was not found");
      }
      
      await prisma.results.create({
          data: {
              id: uuid(),
              competitor_one: player1.id,
              competitor_two: player2.id,
              competition: competition.id,
              round: roundNumber,
          },
      });
      
    }
    roundNumber++;
}

   
res.json({ success: true, competitionId: competition.id });

  } catch (error:unknown) {
    if (error instanceof Error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
  } else {
      console.error('An unexpected error occurred:', error);
      res.status(500).json({ success: false, error: 'An unexpected error occurred' });
  }
}}

