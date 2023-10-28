import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isCompetitionOwner } from '../api/isCompetitionOwner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TableEntry {
  playerId: number;
  playerName: string;
  points: number;
}

const CompetitionTable: React.FC <{ isOwner: boolean }> = ({ isOwner }) => {
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
        }
    }, [id]);

    
      
    const handleCopyLink = () => {
        const publicUrl = `${window.location.origin}/public-table/${id}`;
        navigator.clipboard.writeText(publicUrl);
        toast.success('Kopiran Link', {
            position: toast.POSITION.TOP_RIGHT,
            
        });
          
    };
    

    if (!isOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Pristup odbijen</h1>
                <p className="text-gray-600">Žao nam je, ali nemate potrebne ovlasti za pristup ovoj stranici. Ako smatrate da je došlo do greške, molimo vas da kontaktirate administratora.</p>
              </div>
            </div>
          );
          
      }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-5">
             <ToastContainer />
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-5">Tablica za natjecanje: {competitionName}</h1>
                    <button onClick={handleCopyLink} className="mb-5 p-2 bg-blue-500 text-white rounded">
                        Kopiraj link tablice
                    </button>
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

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(context) {
      const { req, res } = context;
      const competitionId = context.params?.id;
  
      if (typeof competitionId === 'string') {
        const isOwner = await isCompetitionOwner({ req, res }, competitionId);
        return {
          props: { isOwner },
        };
      }
  
      return { props: { isOwner: false } };
    },
  });
