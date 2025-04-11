import { useCallback, useEffect, useState } from 'react'
import { Button, Grid } from '@mui/material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { getMovies } from '../API'
import MovieDto from '../assets/MovieDto'
import MovieCard from '../components/MovieCard'

interface MoviesListProps {
    moviesList: MovieDto[];
}

const MoviesList: React.FC<MoviesListProps> = ({ moviesList }) => {
    const [urlParams, setUrlParams] = useState(new URLSearchParams(window.location.search));
    const [forceRender, setForceRender] = useState(0); // State to trigger re-render
    // const [filteredMovies, setFilteredMovies] = useState<MovieDto[]>([]);

    const rerender = useCallback(() => {
        setForceRender((prev) => prev + 1); // Increment the state to trigger re-render
        console.log('Rerender triggered');
      }, []);

    // useEffect(() => {
    //     setFilteredMovies(moviesList.filter((movie) => filterMovies(movie)));
    // }, [urlParams]);

    // useEffect(() => {
    //     const handleUrlChange = () => {
    //         setUrlParams(new URLSearchParams(window.location.search));
    //     };
    //     const handlePopState = () => {
    //         console.log('popstate event triggered');
    //         setFilteredMovies(moviesList.filter((movie) => filterMovies(movie)));
    //         console.log('Movies list:', moviesList);
    //         console.log('URL params:', urlParams);
    //         console.log('Filtered movies:', moviesList.filter((movie) => filterMovies(movie)));
    //         console.log('Filtered movies:', filteredMovies);
    //     };

    //     window.addEventListener('changeparams', handlePopState);

    //     return () => {
    //         window.removeEventListener('popstate', handleUrlChange);
    //         window.removeEventListener('pushstate', handleUrlChange);
    //         window.removeEventListener('replacestate', handleUrlChange);
    //     };
    // }, [moviesList, filteredMovies, urlParams]);

    // useEffect(() => {
    //     console.log('Force render triggered:', forceRender);
    //     // Any additional logic to handle re-rendering can go here
    // }, [forceRender]);

    const goToMoviePage = (movieId: number) => {
        window.location.href = `/movie/${movieId}`
    }

    const filterMovies = (movie: MovieDto) => {
        const genre = urlParams.get('genre');
        const duration = urlParams.get('duration');
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

        const creationDate = urlParams.get('date');
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

        const name = urlParams.get('searchTerm');

        const matchesGenre = genre ? movie.genre.toLowerCase() === genre : true;
        const matchesDuration = movie.duration >= (parseInt(minDuration)) &&
                                movie.duration <= (parseInt(maxDuration));
        const matchesYear = movie.creation_date.getFullYear() >= (parseInt(startYear)) &&
                            movie.creation_date.getFullYear() <= (parseInt(endYear));
        const matchesName = name ? movie.title.toLowerCase().includes(name.toLowerCase()) : true;

        console.log('filterMovies', movie.title);
        // console.log('matchesGenre', matchesGenre);
        console.log('genre', genre);
        // console.log('movie genre', movie.genre);
        // console.log('matchesDuration', matchesDuration);
        // console.log('duration', duration);
        // console.log('minDuration', minDuration);
        // console.log('maxDuration', maxDuration);
        // console.log('duration', movie.duration);
        // console.log('matchesYear', matchesYear);
        // console.log('matchesName', matchesName);
        console.log('result', matchesGenre && matchesDuration && matchesYear && matchesName);
        return matchesGenre && matchesDuration && matchesYear && matchesName;
    };

  return (
    <>
      <h1>Movies</h1>
      <div className="movie-list">
        <Grid container justifyContent="center">
          {moviesList.filter((movie) => filterMovies(movie)).map((movie) => (
            <Button 
              key={movie.id} 
              onClick={() => { goToMoviePage(movie.id) }} 
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <MovieCard movie={movie} />
            </Button>
            // <MovieCard key={movie.id} movie={movie} />
          ))}
        </Grid>
      </div>
    </>
  )
};

export default MoviesList;