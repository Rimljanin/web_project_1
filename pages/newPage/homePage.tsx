import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { UserProfile } from '@auth0/nextjs-auth0/client';

interface ProfileProps {
  user: UserProfile;
}

export default function Profile({ user }: ProfileProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [competitionName, setCompetitionName] = useState('');
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [winPoints, setWinPoints] = useState('');
  const [drawPoints, setDrawPoints] = useState('');
  const [lossPoints, setLossPoints] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter();

  const resetForm = () => {
    setCompetitionName('');
    setCurrentParticipant('');
    setParticipants([]);
    setWinPoints('');
    setDrawPoints('');
    setLossPoints('');
    setErrorMessage(null);
  };

  const resetFormAndGoBack = () => {
    resetForm();
    router.back();
  };

  const toggleGeneratingState = () => {
    setIsGenerating(!isGenerating);
  };

  const isGenerirajDisabled = () => {
    if (!competitionName || !winPoints || !drawPoints || !lossPoints || isGenerating) {
      return true;
    }
    if (participants.length < 4 || participants.length > 8) {
      return true;
    }
    return false;
  };

  const addParticipant = () => {
    if (!currentParticipant) {
      setErrorMessage("Participant name can't be empty.");
      return;
    }
    if (participants.includes(currentParticipant)) {
      setErrorMessage("Participant names must be unique.");
      return;
    }
    setParticipants(prev => [...prev, currentParticipant]);
    setCurrentParticipant('');
    setErrorMessage(null);
  };

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  const handleCreateCompetition = async () => {
    toggleGeneratingState();
    setErrorMessage(null);

    if (!competitionName || !winPoints || !drawPoints || !lossPoints) {
      setErrorMessage("Please fill in all the fields.");
      toggleGeneratingState();
      return;
    }
    if (participants.length < 4 || participants.length > 8) {
      setErrorMessage("Participants should be between 4 and 8.");
      toggleGeneratingState();
      return;
    }

    try {
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

      if (!response.ok) {
        throw new Error("Failed to create competition.");
      }

      const data = await response.json();
      console.log("New competition created:", data);
      if (data.competitionId) {
        await generateTable(data.competitionId);
      } else {
        throw new Error("Failed to retrieve competition ID.");
      }

      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      toggleGeneratingState();
      router.back();
    }
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
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-3/4 max-w-xl shadow-xl border border-blue-200 hover:border-gray-300 transition duration-300 relative">
        
        <input 
          type="text"
          className="border mb-2 p-2 w-full rounded transition duration-150 focus:border-blue-500 focus:outline-none"
          placeholder="Naziv natjecanja" 
          value={competitionName} 
          onChange={e => setCompetitionName(e.target.value)} 
        />
        
        <div className="flex mb-2">
          <input 
            type="text" 
            className="border p-2 flex-grow mr-2 rounded transition duration-150 focus:border-blue-500 focus:outline-none"
            placeholder="Dodaj natjecatelja" 
            value={currentParticipant} 
            onChange={e => setCurrentParticipant(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && addParticipant()}
          />
          <button onClick={addParticipant} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-150">+</button>
        </div>
        
        <div className="mb-4 bg-gray-50 rounded p-2">
          {participants.map(participant => (
            <div key={participant} className="flex items-center mb-2">
              <div className="border p-2 flex-grow rounded bg-white">{participant}</div>
              <button onClick={() => removeParticipant(participant)} className="bg-red-500 text-white p-2 ml-2 rounded hover:bg-red-700 transition duration-150">-</button>
            </div>
          ))}
        </div>
        
        <input 
          type="number" 
          className="border p-2 w-full mb-2 rounded transition duration-150 focus:border-blue-500 focus:outline-none" 
          placeholder="Bodovi za pobjedu" 
          value={winPoints} 
          onChange={e => setWinPoints(e.target.value)} 
        />
        
        <input 
          type="number" 
          className="border p-2 w-full mb-2 rounded transition duration-150 focus:border-blue-500 focus:outline-none" 
          placeholder="Bodovi za neriješeno" 
          value={drawPoints} 
          onChange={e => setDrawPoints(e.target.value)} 
        />
        
        <input 
          type="number" 
          className="border p-2 w-full mb-4 rounded transition duration-150 focus:border-blue-500 focus:outline-none" 
          placeholder="Bodovi za poraz" 
          value={lossPoints} 
          onChange={e => setLossPoints(e.target.value)} 
        />
        
        {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
        
        <button 
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCreateCompetition}
          disabled={isGenerirajDisabled()}
          className={`bg-blue-600 text-white px-4 py-2 rounded transition duration-150 mb-2 mr-2 
            ${isGenerirajDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
          {isGenerating ? "Generiranje..." : "Generiraj"}
          {isHovered && isGenerirajDisabled() && (
          <div className="absolute z-10 w-64 bg-black text-white text-sm rounded p-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-90">
          Morate popuniti sistem bodovanja i imati između 4 i 8 igrača.
            <div className="tooltip-arrow" />
            </div>
          )}
        </button>
        
        <button 
          onClick={resetFormAndGoBack} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-150">
          Odustani
        </button>
        
      </div>
    </div>
  );
  
  
  }
  
  export const getServerSideProps = withPageAuthRequired();