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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/getCompetitionTable?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    setTableData(data.tableData);
                    setCompetitionName(data.competitionName);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching competition table:", error);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-5">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-5">Tablica za natjecanje: {competitionName}</h1>
                    <div className="w-full max-w-4xl bg-white p-6 rounded shadow-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Natjecatelj</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bodovi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tableData.map((entry, index) => (
                                    <tr key={entry.playerId}>
                                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{entry.playerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{entry.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
export default CompetitionTable;
