import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

const Home: React.FC = () => {
  const { user, error, isLoading } = useUser();
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/getUsersCompetitions?email=${user.email}`)
        .then(response => response.json())
        .then(data => setCompetitions(data))
        .catch(error => console.error("Error fetching competitions:", error));
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
            <a href="/api/auth/logout" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
              Logout
            </a>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="p-6 bg-white rounded shadow-lg w-96">
              <h1 className="text-2xl font-bold mb-4 text-center">Izaberite opciju:</h1>
              <Link href="/newPage/homePage">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4 block w-full text-center">
                  Napravi novo natjecanje
                </button>
              </Link>
              {competitions.length > 0 ? (
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
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-200 to-blue-300">
          <div className="p-8 bg-white rounded-xl shadow-xl w-96 transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-3xl font-semibold mb-6 text-center">Dobro došli na našu stranicu!</h1>
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

