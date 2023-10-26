import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; 

const getCompetitionResults = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Competition ID is required' });
    }

    try {
        const results = await prisma.results.findMany({
            where: {
                competition: id as string,
            },
            include: {
                player_results_competitor_oneToplayer: true,
                player_results_competitor_twoToplayer: true,
                competition_results_competitionTocompetition: true,
            },
        });

        const formattedResults = results.map(result => ({
            id: result.id,
            competitor_one: result.player_results_competitor_oneToplayer.name,
            competitor_two: result.player_results_competitor_twoToplayer.name,
            competitor_one_score: result.competitor_one_score,
            competitor_two_score: result.competitor_two_score,
            competitionName: result.competition_results_competitionTocompetition.name,
            round: result.round
        }));

        return res.status(200).json(formattedResults);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch competition results' });
    }
};

export default getCompetitionResults;