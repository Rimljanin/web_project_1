import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

interface ProfileProps {
  user: UserProfile;
}

export default function Profile({ user }: ProfileProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [competitionName, setCompetitionName] = useState('');
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [winPoints, setWinPoints] = useState('');
  const [drawPoints, setDrawPoints] = useState('');
  const [lossPoints, setLossPoints] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const resetFormAndGoBack = () => {
  
    setCompetitionName('');
    setParticipants([]);
    setCurrentParticipant('');
    setWinPoints('');
    setDrawPoints('');
    setLossPoints('');
    setErrorMessage(null);

    router.back();
  };

  const toggleModal = () => {
    setCompetitionName('');
    setCurrentParticipant('');
    setParticipants([]);
    setWinPoints('');
    setDrawPoints('');
    setLossPoints('');
    setErrorMessage(null);
    setModalVisible(!isModalVisible);
  };

  const isGenerirajDisabled = () => {
    if (!competitionName || !winPoints || !drawPoints || !lossPoints) {
      return true;
    }
    if (participants.length < 4 || participants.length > 8) {
      return true;
    }
    return false;
};

  const addParticipant = () => {
    if (currentParticipant) {
      setParticipants(prev => [...prev, currentParticipant]);
      setCurrentParticipant(''); 
    }
  };

  const handleCreateCompetition = async () => {
    if (!competitionName || !winPoints || !drawPoints || !lossPoints) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }
    if (participants.length < 4 || participants.length > 8) {
      setErrorMessage("Participants should be between 4 and 8.");
      return;
    }
    setErrorMessage(null);
    {
      const response = await fetch('/api/createCompetition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: user.email, 
          name: user.name, 
          competitionName, 
          participants, 
          winPoints, 
          drawPoints, 
          lossPoints 
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("New competition created:", data);
        if (data.competitionId) {
          await generateTable(data.competitionId);
        }
  
        } else {
          console.error("Failed to retrieve competition ID.");
        }
    };
    toggleModal();
    router.back();
  };

  const generateTable = async (competitionId: string) => {
    try {
      const response = await fetch('/api/generateTabel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ competitionId })
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate the table.");
      }
  
      console.log("Table generated successfully for competition", competitionId);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };
  

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center items-center">
    <div className="bg-white rounded-lg p-8 w-3/4 max-w-xl shadow-xl border border-gray-200 hover:border-gray-300 transition duration-300 relative">
      
      <input 
        type="text"
        className="border mb-2 p-2 w-full rounded transition duration-150 focus:border-blue-500 focus:outline-none"
        placeholder="Competition Name" 
        value={competitionName} 
        onChange={e => setCompetitionName(e.target.value)} 
      />
      <div className="flex mb-2">
        <input 
          type="text" 
          className="border p-2 flex-grow mr-2 rounded transition duration-150 focus:border-blue-500 focus:outline-none"
          placeholder="Add Participant" 
          value={currentParticipant} 
          onChange={e => setCurrentParticipant(e.target.value)} 
        />
        <button onClick={addParticipant} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-150">+</button>
      </div>
      <div className="mb-4 bg-gray-50 rounded p-2">
        {participants.map(participant => <div key={participant} className="border p-2 mb-2 rounded bg-white">{participant}</div>)}
      </div>
      <input type="number" className="border p-2 w-full mb-2 rounded transition duration-150 focus:border-blue-500 focus:outline-none" placeholder="Points for Win" value={winPoints} onChange={e => setWinPoints(e.target.value)} />
      <input type="number" className="border p-2 w-full mb-2 rounded transition duration-150 focus:border-blue-500 focus:outline-none" placeholder="Points for Draw" value={drawPoints} onChange={e => setDrawPoints(e.target.value)} />
      <input type="number" className="border p-2 w-full mb-4 rounded transition duration-150 focus:border-blue-500 focus:outline-none" placeholder="Points for Loss" value={lossPoints} onChange={e => setLossPoints(e.target.value)} />
      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
      <button 
        onClick={handleCreateCompetition}
        disabled={isGenerirajDisabled()}
        className={`bg-blue-600 text-white px-4 py-2 rounded transition duration-150 mb-2 mr-2 
          ${isGenerirajDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
        Generate
      </button>
      <button onClick={resetFormAndGoBack} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-150">Cancel</button>
    </div>
  </div>
);

}

export const getServerSideProps = withPageAuthRequired();





