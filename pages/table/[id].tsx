import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface TableEntry {
  playerId: number;
  playerName: string;
  points: number;
}

const CompetitionTable: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const [tableData, setTableData] = useState<TableEntry[]>([]);
    const [competitionName, setCompetitionName] = useState("");

    useEffect(() => {
        if (id) {
            fetch(`/api/getCompetitionTable?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    setTableData(data.tableData);
                    setCompetitionName(data.competitionName);
                })
                .catch(error => console.error("Error fetching competition table:", error));
        }
    }, [id]);

    const handleCopyLink = () => {
        const publicUrl = `${window.location.origin}/public-table/${id}`;
        navigator.clipboard.writeText(publicUrl);
        alert('Javni link kopiran na clipboard!');
    };
    
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-5">
            <h1 className="text-2xl font-bold mb-5">Table for Competition: {competitionName}</h1>
            <button onClick={handleCopyLink} className="mb-5 p-2 bg-blue-500 text-white rounded">
                Kopiraj link tablice
            </button>
            <div className="w-full max-w-4xl bg-white p-6 rounded shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.map((entry, index) => (
                            <tr key={entry.playerId}>
                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{entry.playerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{entry.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default CompetitionTable;

export const getServerSideProps = withPageAuthRequired();
