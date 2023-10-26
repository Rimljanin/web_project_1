import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const Competition: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const [competitionResults, setCompetitionResults] = useState([]);
    const [gradingSystem, setGradingSystem] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id) {
            fetch(`/api/getCompetitionResults?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    const sortedData = data.sort((a, b) => a.round - b.round);
                    setCompetitionResults(sortedData);
                })
                .catch(error => console.error("Error fetching competition results:", error));

            fetch(`/api/getCompetitionGradingSystem?id=${id}`)
                .then(response => response.json())
                .then(data => setGradingSystem(data))
                .catch(error => console.error("Error fetching competition grading system:", error));
        }
    }, [id]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
        
          await fetch('/api/saveCompetitionResults', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(competitionResults),
          });
      
          await fetch('/api/updateCompetitionTable', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ competitionId: id }),
          });
      
          toast.success('Rezultati su uspješno spremljeni i bodovi su ažurirani!');
        } catch (error) {
          console.error("Error:", error);
          toast.error("Došlo je do greške prilikom spremanja i ažuriranja.");
        }
        setIsSaving(false);
      };

    toast.success('Rezultati su uspješno spremljeni!');

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-5">
            <h1 className="text-2xl font-bold mb-5">Raspored i rezultati za {competitionResults[0]?.competitionName || id}</h1>
            
            <div className="w-full max-w-4xl bg-white p-6 rounded shadow-lg flex flex-col md:flex-row">
                {/* Results */}
                <div className="flex-1 mr-0 md:mr-6 mb-4 md:mb-0">
                    {competitionResults.map(result => (
                        <div key={result.id} className="flex flex-col mb-6">
                            <div className="mb-4">
                                <span className="font-bold text-lg">{result.round}. kolo</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{result.competitor_one} vs. {result.competitor_two}</span>
                                <div className="flex items-center">
                                    <input type="number" 
                                        value={result.competitor_one_score !== undefined ? result.competitor_one_score : ''}  
                                        onChange={(e) => {
                                            const updatedResults = [...competitionResults];
                                            const index = updatedResults.findIndex(r => r.id === result.id);
                                            updatedResults[index].competitor_one_score = e.target.value ? Number(e.target.value) : null;
                                            setCompetitionResults(updatedResults);
                                        }} 
                                        className="p-2 border rounded mr-2 w-16"
                                    />
                                    <input type="number" 
                                        value={result.competitor_two_score !== undefined ? result.competitor_two_score : ''} 
                                        onChange={(e) => {
                                            const updatedResults = [...competitionResults];
                                            const index = updatedResults.findIndex(r => r.id === result.id);
                                            updatedResults[index].competitor_two_score = e.target.value ? Number(e.target.value) : null;
                                            setCompetitionResults(updatedResults);
                                        }} 
                                        className="p-2 border rounded w-16"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className={`px-4 py-2 rounded bg-blue-600 text-white ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                        {isSaving ? 'Saving...' : 'Save Results'}
                    </button>
                </div>

                {/* Grading System */}
                <div className="flex-none w-64">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Sustav bodovanja</h2>
                    <p className="mt-2"><strong>Pobjeda:</strong> {gradingSystem?.win} bodova</p>
                    <p><strong>Neriješeno:</strong> {gradingSystem?.draw} bodova</p>
                    <p><strong>Poraz:</strong> {gradingSystem?.loss} bodova</p>
                    <button 
                        onClick={() => router.push(`/table/${id}`)} 
                        className="mt-4 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                        View Table
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Competition;

export const getServerSideProps = withPageAuthRequired();