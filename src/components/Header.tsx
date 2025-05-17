import React, { useEffect } from 'react';
import CityDto from '../assets/CityDto';
import { getCities } from '../API';
import { useAuth } from '../AuthContext';
import { isAdmin } from '../global';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
    city: string;
    setCity: React.Dispatch<React.SetStateAction<string>>;
    sessionDate: string;
    setSessionDate: React.Dispatch<React.SetStateAction<string>>;
    genre: string;
    setGenre: React.Dispatch<React.SetStateAction<string>>;
    duration: string;
    setDuration: React.Dispatch<React.SetStateAction<string>>;
    creationDate: string;
    setCreationDate: React.Dispatch<React.SetStateAction<string>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const Header: React.FC<HeaderProps> = ({ city, setCity, sessionDate, setSessionDate, genre, setGenre, duration, setDuration, creationDate, setCreationDate, searchTerm, setSearchTerm }) => {
    const [cityList, setCityList] = React.useState<CityDto[]>([]);
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getCities()
            .then((data) => {
                setCityList(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    
    const handleSearch = () => {
        setSearchTerm(searchTerm);
    };

    const handleReset = () => {
        setCity('');
        setSessionDate('');
        setGenre('');
        setDuration('');
        setCreationDate('');
        setSearchTerm('');
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header style={{ 
            // width: 'calc(100% - 4rem)', // Adjust width to account for padding
            width: 'auto',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            paddingLeft: '2rem',
            paddingRight: '2rem'
        }}>
            {/* <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Select City</option>
                {cityList.map((city) => (
                    <option key={city.postalCode} value={city.postalCode}>
                        {city.name} ({city.postalCode})
                    </option>
                ))}
            </select> */}

            {/* <select value={sessionDate} onChange={(e) => setSessionDate(e.target.value)}>
            <option value="">All</option>
            <option value="ended">Ended</option>
            <option value="current">Current</option>
            <option value="upcoming">Upcoming</option>
            </select> */}

            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Select Genre</option>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="horror">Horror</option>
            <option value="science fiction">Science Fiction</option>
            <option value="crime">Crime</option>
            <option value="thriller">Thriller</option>
            <option value="fantasy">Fantasy</option>
            </select>

            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="">Select Duration</option>
            <option value="0-30">0-30 mins</option>
            <option value="30-60">30-60 mins</option>
            <option value="60-120">60-120 mins</option>
            <option value="120-180">120-180 mins</option>
            <option value=">120">{'>'}180 mins</option>
            </select>

            <select value={creationDate} onChange={(e) => setCreationDate(e.target.value)}>
            <option value="">Select Creation Period</option>
            <option value="0-5">0-5 years ago</option>
            <option value="5-10">5-10 years ago</option>
            <option value="10-20">10-20 years ago</option>
            <option value=">20">{'>'}20 years ago</option>
            </select>

            <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.5rem' }}
            onKeyPress={handleKeyPress}
            />

            <button onClick={handleReset} style={{ padding: '0.5rem 1rem' }}>
            Reset
            </button>
            <button
                onClick={() => {
                    if (token) {
                        logout();
                    } else {
                        navigate('/login');
                    }
                }}
                style={{ padding: '0.5rem 1rem' }}
            >
                {token ? 'Déconnexion' : 'Connexion'}
            </button>
            {isAdmin}
        </header>
    );
};

export default Header;