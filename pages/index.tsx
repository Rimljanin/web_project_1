import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';


interface Competition {
  id: string;
  name: string;
}

const Home: React.FC = () => {
  const { user, error, isLoading } = useUser();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loadingCompetitions, setLoadingCompetitions] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/getUsersCompetitions?email=${user.email}`)
        .then(response => response.json())
        .then(data => setCompetitions(data))
        .catch(error => console.error("Error fetching competitions:", error));
        setLoadingCompetitions(false)
    }
  }, [user]);

  if (isLoading) return <div>LOADING...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 relative">
      {user ? (
        <>
          <div className="absolute top-4 right-4">
            <h1 className="text-lg font-bold mb-4">Dobro došli, {user.name}!</h1>
            <Link href="/api/auth/logout" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
              Logout
            </Link>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="p-6 bg-white rounded shadow-lg w-96">
              <h1 className="text-2xl font-bold mb-4 text-center">Izaberite opciju:</h1>
              <Link href="/newPage/homePage">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4 block w-full text-center">
                  Napravi novo natjecanje
                </button>
                </Link>
              {loadingCompetitions ? (
                <div>Loading...</div>
              ) : (
                competitions.length > 0 ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Vaša natjecanja</h2>
                    {competitions.map(comp => (
                      <Link href={`/competitions/${comp.id}`} key={comp.id}>
                        <div className="bg-gray-200 hover:bg-gray-300 hover:shadow-lg transform hover:scale-101 transition-all mb-4 p-4 rounded flex items-center cursor-pointer">
                          <span>{comp.name}</span>
                        </div>
                      </Link>
                    ))}
                  </>
                ) : (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-5 rounded">
                    <p className="font-bold">Obavijest:</p>
                    <p>Nemate natjecanja.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-light-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-wrap justify-between items-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full animate-move"></div>
          <div className="w-16 h-16 bg-blue-500 rounded-full animate-move delay-1000"></div>
          <div className="w-16 h-16 bg-yellow-700 rounded-full animate-move delay-2000"></div>
          <div className="w-16 h-16 bg-yellow-500 rounded-full animate-move delay-3000"></div>
          <div className="w-16 h-16 bg-green-700 rounded-full animate-move delay-4000"></div>
          <div className="w-16 h-16 bg-green-700 rounded-full animate-move delay-5000"></div>
        </div>
        
        <div className="p-8 bg-white rounded-xl shadow-xl w-96 z-10">
          <h1 className="text-3xl font-semibold mb-6 text-center">Dobro došli na stranicu za izradu i vođenje natjecanja!</h1>
          <div className="flex flex-col space-y-4">
          <Link href="/api/auth/login" className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full text-center">
                Nastavi
              </Link>
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
}

export default Home;

