import { getSession } from "@auth0/nextjs-auth0";
import prisma from '../../lib/prisma';

export const isCompetitionOwner = async (reqRes: { req: any, res: any }, competitionId: string) => {
    const session = await getSession(reqRes.req, reqRes.res);

  if (!session || !session.user) {
    return false;
  }

  const userEmail = session.user.email;
  
  const competition = await prisma.competition.findUnique({
    where: { id: competitionId },
    include: { user_owner: true } 
  });

  if (!competition || !competition.user_owner) {
    return false;
  }

  return competition.user_owner.email === userEmail;
};
