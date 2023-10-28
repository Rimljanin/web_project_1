import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsRugbyIcon from '@mui/icons-material/SportsRugby';
import MovingIcon from './api/front-helper/movingIcon';
import SportsBaseball from '@mui/icons-material/SportsBaseball';
import SportsHandball from '@mui/icons-material/SportsHandball';
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';


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

  
  const [showIcons, setShowIcons] = useState(true);

  const toggleIcons = () => {
    setShowIcons(!showIcons);
  };




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
                      <Link href={`/competitions/${comp.id}`} key={comp.id} className="block">
                          <div className="bg-gray-200 hover:bg-gray-300 hover:shadow-lg transform hover:scale-101 transition-all mb-4 p-4 rounded flex items-center cursor-pointer">
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">{comp.name}</span>
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
        <div className="min-h-screen bg-space-dark flex items-center justify-center relative overflow-hidden">
          {showIcons && (
            <>
          <MovingIcon IconComponent={SportsHandball} startPosition={{ x: 1300, y: 700 }} />
          <MovingIcon IconComponent={SportsBaseballIcon} startPosition={{ x: 400, y: 100 }} />
          <MovingIcon IconComponent={SportsCricketIcon} startPosition={{ x: 700, y: 100 }} />
          <MovingIcon IconComponent={SportsBaseball} startPosition={{ x: 1000, y: 100 }} />
          <MovingIcon IconComponent={SportsFootballIcon} startPosition={{ x: 1300, y: 100 }} />
              
          <MovingIcon IconComponent={SportsTennisIcon} startPosition={{ x: 1300, y: 300 }} />
          <MovingIcon IconComponent={SportsFootballIcon} startPosition={{ x: 100, y: 300 }} />
          <MovingIcon IconComponent={SportsHockeyIcon} startPosition={{ x: 400, y: 300 }} />
          <MovingIcon IconComponent={SportsCricketIcon} startPosition={{ x: 700, y: 300 }} />
          <MovingIcon IconComponent={SportsBaseballIcon} startPosition={{ x: 1000, y: 300 }} />
          <MovingIcon IconComponent={SportsHandballIcon} startPosition={{ x: 1300, y: 300 }} />

          <MovingIcon IconComponent={SportsTennisIcon} startPosition={{ x: 100, y: 300 }} />
          <MovingIcon IconComponent={SportsFootballIcon} startPosition={{ x: 100, y: 300 }} />
          <MovingIcon IconComponent={SportsHockeyIcon} startPosition={{ x: 1400, y: 400 }} />
          <MovingIcon IconComponent={SportsCricketIcon} startPosition={{ x: 1700, y: 500 }} />
          <MovingIcon IconComponent={SportsBaseballIcon} startPosition={{ x: 1800, y: 600 }} />
          <MovingIcon IconComponent={SportsHandballIcon} startPosition={{ x: 2000, y: 700 }} />
              
          <MovingIcon IconComponent={SportsVolleyballIcon} startPosition={{ x: 100, y: 500 }} />
          <MovingIcon IconComponent={SportsRugbyIcon} startPosition={{ x: 400, y: 500 }} />
          <MovingIcon IconComponent={SportsFootballIcon} startPosition={{ x: 700, y: 500 }} />
          <MovingIcon IconComponent={SportsHockeyIcon} startPosition={{ x: 1000, y: 500 }} />
          <MovingIcon IconComponent={SportsRugbyIcon} startPosition={{ x: 120, y: 200 }} />

          <MovingIcon IconComponent={SportsTennisIcon} startPosition={{ x: 700, y: 700 }} />    
          <MovingIcon IconComponent={SportsHandballIcon} startPosition={{ x: 100, y: 700 }} />
          <MovingIcon IconComponent={SportsCricketIcon} startPosition={{ x: 400, y: 700 }} />
          <MovingIcon IconComponent={SportsFootballIcon} startPosition={{ x: 700, y: 700 }} />
          <MovingIcon IconComponent={SportsHockeyIcon} startPosition={{ x: 1000, y: 700 }} />
          <MovingIcon IconComponent={SportsCricketIcon} startPosition={{ x: 1300, y: 700 }} />

          <MovingIcon IconComponent={SportsSoccerIcon} startPosition={{ x: 100, y: 200 }} />
          <MovingIcon IconComponent={SportsHandballIcon} startPosition={{ x: 1700, y: 700 }} />
          <MovingIcon IconComponent={SportsCricketIcon} startPosition={{ x: 400, y: 700 }} />
          <MovingIcon IconComponent={SportsFootballIcon} startPosition={{ x: 700, y: 700 }} />
          <MovingIcon IconComponent={SportsHockeyIcon} startPosition={{ x: 1000, y: 700 }} />
          <MovingIcon IconComponent={SportsCricketIcon} startPosition={{ x: 1300, y: 700 }} />

          <MovingIcon IconComponent={Filter1Icon} startPosition={{ x: 250, y: 250 }} />
          <MovingIcon IconComponent={Filter2Icon} startPosition={{ x: 550, y: 550 }} />
          <MovingIcon IconComponent={Filter3Icon} startPosition={{ x: 1800, y: 850 }} />
          <MovingIcon IconComponent={Filter4Icon} startPosition={{ x: 150, y: 150 }} />
          <MovingIcon IconComponent={Filter5Icon} startPosition={{ x: 1500, y: 150 }} />
          <MovingIcon IconComponent={Filter6Icon} startPosition={{ x: 1750, y: 500 }} />
          <MovingIcon IconComponent={Filter7Icon} startPosition={{ x: 2050, y: 700 }} />
          </>
          )}
          <div className="p-8 bg-white rounded-xl shadow-xl w-96 z-10 text-center">
            <h1 className="text-3xl font-semibold mb-6">Dobro došli na stranicu za izradu i vođenje natjecanja!</h1>
            <Link href="/api/auth/login" className="inline-block bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full">
              Nastavi
            </Link>
          </div>

          <button
            onClick={toggleIcons}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            {showIcons ? 'Isključi ikone' : 'Uključi ikone'}
          </button>
        </div>

      )}
    </div>
  );
}

export default Home;

