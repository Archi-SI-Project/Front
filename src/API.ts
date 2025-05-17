import axios, { AxiosResponse } from 'axios';
import MovieDto, { MovieCreationDto } from './assets/MovieDto';
import SessionDto, { SessionAddToDbDto, SessionCreationDto, SessionDefinitionDto } from './assets/SessionDto';
import CityDto from './assets/CityDto';
import MockData from './MockData.json';
import MovieTheaterDto from './assets/MovieTheaterDto';

const BASE_URL = '/api';

const axiosInstance = axios.create({
    baseURL: '',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 5000, // Optional: Set a timeout for requests
});

const filterMovies = (movie: MovieDto, genre: string, duration: string, creationDate: string, searchTerm: string) => {
    let minDuration = '0';
    let maxDuration = '10000000000';
    switch (duration) {
        case '0-30':
            minDuration = '0';
            maxDuration = '30';
            break;
        case '30-60':
            minDuration = '30';
            maxDuration = '60';
            break;
        case '60-120':
            minDuration = '60';
            maxDuration = '120';
            break;
        case '120-180':
            minDuration = '120';
            maxDuration = '180';
            break;
        case '>120':
            minDuration = '180';
            maxDuration = '10000000000';
            break;
        default:
            break;
    }

    let startYear = '0';
    let endYear = new Date().getFullYear().toString();
    switch (creationDate) {
        case '0-5':
            startYear = (new Date().getFullYear() - 5).toString();
            endYear = new Date().getFullYear().toString();
            break;
        case '5-10':
            startYear = (new Date().getFullYear() - 10).toString();
            endYear = (new Date().getFullYear() - 5).toString();
            break;
        case '10-20':
            startYear = (new Date().getFullYear() - 20).toString();
            endYear = (new Date().getFullYear() - 10).toString();
            break;
        case '>20':
            startYear = '0';
            endYear = (new Date().getFullYear() - 20).toString();
            break;
        default:
            break;
    }

    const matchesGenre = genre ? movie.genre.toLowerCase() === genre : true;
    const matchesDuration = movie.duration >= (parseInt(minDuration)) &&
        movie.duration <= (parseInt(maxDuration));
    const matchesYear = new Date(movie.creationDate).getFullYear() >= (parseInt(startYear)) &&
        new Date(movie.creationDate).getFullYear() <= (parseInt(endYear));
    const matchesName = searchTerm ? movie.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    // console.log('filterMovies', movie.title);
    // console.log('matchesGenre', matchesGenre);
    // console.log('genre', genre);
    // console.log('movie genre', movie.genre);
    // console.log('matchesDuration', matchesDuration);
    // console.log('duration', duration);
    // console.log('minDuration', minDuration);
    // console.log('maxDuration', maxDuration);
    // console.log('duration', movie.duration);
    // console.log('matchesYear', matchesYear);
    // console.log('matchesName', matchesName);
    console.log(movie.title, matchesGenre && matchesDuration && matchesYear && matchesName);
    return matchesGenre && matchesDuration && matchesYear && matchesName;
};

const minMaxDuration = (duration: string) => {
    let minDuration = 0;
    let maxDuration;
    switch (duration) {
        case '0-30':
            minDuration = 0;
            maxDuration = 30;
            break;
        case '30-60':
            minDuration = 30;
            maxDuration = 60;
            break;
        case '60-120':
            minDuration = 60;
            maxDuration = 120;
            break;
        case '120-180':
            minDuration = 120;
            maxDuration = 180;
            break;
        case '>120':
            minDuration = 180;
            break;
        default:
            break;
    }
    return { minDuration, maxDuration };
};

const minMaxCreationDate = (creationDate: string) => {
    let startYear = 0;
    let endYear = new Date().getFullYear();
    switch (creationDate) {
        case '0-5':
            startYear = new Date().getFullYear() - 5;
            endYear = new Date().getFullYear();
            break;
        case '5-10':
            startYear = new Date().getFullYear() - 10;
            endYear = new Date().getFullYear() - 5;
            break;
        case '10-20':
            startYear = new Date().getFullYear() - 20;
            endYear = new Date().getFullYear() - 10;
            break;
        case '>20':
            startYear = 0;
            endYear = new Date().getFullYear() - 20;
            break;
        default:
            break;
    }
    return { startYear, endYear };
}

export async function getMovies(): Promise<MovieDto[]> {
    // return MockData.map(movie => ({
    //     ...movie,
    //     creation_date: new Date(movie.creation_date),
    // }));
    try {
        console.log('getMovies');
        const response = await axiosInstance.get(`${BASE_URL}/movies`,
            {
                headers: {
                Accept: 'application/json',
                },
            }
        );
        const res = response.data.map((movie: unknown) => movie);
        console.log(res);
        return res;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

export async function getMovieById(movieId: number): Promise<MovieDto> {
    // return MockData.map(movie => ({
    //     ...movie,
    //     creation_date: new Date(movie.creation_date),
    // })).find(movie => movie.id === movieId) as MovieDto;
    try {
        const response = await axiosInstance.get(`${BASE_URL}/movies/${movieId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching movie with ID ${movieId}:`, error);
        throw error;
    }
}

export async function getMoviesWithFilter(city: string, sessionDate: string, genre: string, duration: string, creationDate: string, searchTerm: string): Promise<MovieDto[]> {
    // return MockData.map(movie => ({
    //     ...movie,
    //     creation_date: new Date(movie.creation_date),
    // }))
    //     .filter(movie => filterMovies(movie, genre, duration, creationDate, searchTerm));
    try {
        const params: any = { };
        if (city) {
            params.city = city;
        }
        if (sessionDate) {
            params.sessionDate = sessionDate;
        }
        if (genre) {
            params.genre = genre;
        }
        if (searchTerm) {
            params.searchTerm = searchTerm;
        }
        if (duration) {
            const { minDuration, maxDuration } = minMaxDuration(duration);
            params.minDuration = minDuration;
            params.maxDuration = maxDuration;
        }
        if (creationDate) {
            const { startYear: minCreationDate, endYear: maxCreationDate } = minMaxCreationDate(creationDate);
            params.minCreationDate = minCreationDate;
            params.maxCreationDate = maxCreationDate;
        }
        console.log('getMoviesWithFilter', params);
        const response = await axiosInstance.get(`${BASE_URL}/movies/search`, { params });
        return response.data;
    } catch (error) {
        console.error('Error filtering movies:', error);
        throw error;
    }
}

export async function createMovie(movie: MovieCreationDto): Promise<number> {
    try {
        console.log(movie);
        // const response = await axiosInstance.post(`${BASE_URL}/movies/add`, {
        //     title: "best film 5",
        //     duration: 4,
        //     creationDate: "2023-10-01",
        //     language: "EN",
        //     director: "Max",
        //     image: null,
        //     mainActors: null,
        //     minAge: 10,
        //     synopsis: "nul",
        //     genre: "ACTION",
        //     subtitleLanguage: "EN"
        // });
        const response = await axiosInstance.post(`${BASE_URL}/movies/add`, movie,
            { headers: { 'Authorization': `Basic ${localStorage.getItem('auth')}` } },
        );
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error creating movie:', error);
        throw error;
    }
}

export async function deleteMovie(movieId: number): Promise<void> {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/movies/delete/${movieId}`,
            { headers: { 'Authorization': `Basic ${localStorage.getItem('auth')}` } },
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting movie:', error);
        throw error;
    }
}

export async function updateMovie(movieId: number, movie: MovieDto): Promise<void> {
    try {
        console.log(movie);
        const response = await axiosInstance.put(`${BASE_URL}/movies/update/${movieId}`, movie,
            { headers: { 'Authorization': `Basic ${localStorage.getItem('auth')}` } },
        );
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error updating movie:', error);
        throw error;
    }
}

export async function createSession(session: SessionCreationDto): Promise<void> {
    try {
        console.log(session);
        const sessionTransformed: SessionAddToDbDto = {
            ...session,
            idMovie: { id: session.idMovie },
            idMovieTheater: { id: session.idMovieTheater }
        };
        console.log(sessionTransformed);
        const response = await axiosInstance.post(`${BASE_URL}/session/add`, sessionTransformed,
            { headers: { 'Authorization': `Basic ${localStorage.getItem('auth')}` } },
        );
        return response.data;
    } catch (error) {
        console.error('Error creating movie:', error);
        throw error;
    }
}

export async function addNewMovie(movie: MovieCreationDto, sessions: SessionDefinitionDto[]): Promise<void> {
    try {
        console.log(movie);
        console.log(sessions);
        const movieId = await createMovie(movie);
        let movieExisting = null;
        while (!movieExisting) {
            try {
                console.log('getMovieById', movieId);
                movieExisting = await getMovieById(movieId);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    console.log(`Movie with ID ${movieId} not found, retrying...`);
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // Attendre 1 seconde avant de réessayer
                } else {
                    throw error; // Si une autre erreur survient, on la relance
                }
            }
        }
        console.log('movieExisting', movieExisting);
        console.log('movieId', movieId);
        const movieSessions: SessionCreationDto[] = sessions.map(({ creationId, ...session }) => ({
            ...session,
            idMovie: movieId,
        }));
        for (const session of movieSessions) {
            await createSession(session);
        }
    } catch (error) {
        console.error('Error creating movie:', error);
        throw error;
    }
}

const MockDataCity: CityDto[] = [{ postalCode: "75001", name: "Paris" }, { postalCode: "69001", name: "Lyon" }, { postalCode: "13001", name: "Marseille" }, { postalCode: "31000", name: "Toulouse" }, { postalCode: "44000", name: "Nantes" }, { postalCode: "59000", name: "Lille" }, { postalCode: "67000", name: "Strasbourg" }, { postalCode: "33000", name: "Bordeaux" }, { postalCode: "34000", name: "Montpellier" }, { postalCode: "35000", name: "Rennes" }]

export async function getCities(): Promise<CityDto[]> {
    return MockDataCity;
    try {
        const response = await axiosInstance.get(`${BASE_URL}/cities`);
        return response.data;
    } catch (error) {
        console.error('Error searching cities:', error);
        throw error;
    }
}

const MockDataMovieTheaters: MovieTheaterDto[] = [
    { idMovieTheater: 1, cityId: 1, address: "123 Main St", name: "Cineplex" },
    { idMovieTheater: 2, cityId: 2, address: "456 Elm St", name: "Movie World" },
    { idMovieTheater: 3, cityId: 3, address: "789 Oak St", name: "Film House" },
]; 

export async function getMovieTheaters(): Promise<MovieTheaterDto[]> {
    return MockDataMovieTheaters;
    try {
        const response = await axiosInstance.get(`${BASE_URL}/movie_theaters`);
        return response.data;
    } catch (error) {
        console.error('Error searching movie theaters:', error);
        throw error;
    }
}

export async function getSessionsByMovieId(movieId: number): Promise<SessionDto[]> {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/session/movie/${movieId}`);
        console.log('getSessionsByMovieId', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching sessions for movie with ID ${movieId}:`, error);
        throw error;
    }
}

export async function getUsers(credentials: string): Promise<AxiosResponse<any, any>> {
    try {
        // Utilise axios.get pour une URL absolue, comme ta requête manuelle
        const response = await axios.get(
            `${BASE_URL}/users`,
            { headers: { 'Authorization': `Basic ${credentials}` } }
        );
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}
