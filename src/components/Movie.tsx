import React, { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createSession, getMovieById, getMovieTheaters, getSessionsByMovieId } from '../API';
import MovieDto, { MovieCreationDto } from '../assets/MovieDto';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { formatDate } from '../assets/utils';
import MyDatePicker from './MyDatePicker';
import MovieTheaterDto from '../assets/MovieTheaterDto';
import { SessionCreationDto, SessionDefinitionDto } from '../assets/SessionDto';
import { se } from 'react-day-picker/locale';

const Movie: React.FC = () => {
    const { movie_id } = useParams<{ movie_id: string }>()
    if (!movie_id) {
        return <div>Error: Movie ID is missing.</div>;
    }
    const movieId = parseInt(movie_id, 10);
    const [movie, setMovie] = useState<MovieDto>();
    const [movieTheatersList, setMovieTheatersList] = React.useState<MovieTheaterDto[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [sessionSetters, setSessionSetters] = useState<SessionDefinitionDto[]>([{ id_movie_theater: 0, starting_time: new Date(), ending_time: new Date() }]);
    const [sessions, setSessions] = useState<SessionCreationDto[]>([]);
    const [searchParams, setSearchParams] = useState<URLSearchParams | undefined>(new URLSearchParams(window.location.search));

    useEffect(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    useEffect(() => {
        getMovieById(movieId)
            .then(data => setMovie(data))
            .catch(error => console.error(error));
    }, [movieId]);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSessionSetters([{ id_movie_theater: 0, starting_time: new Date(), ending_time: new Date() }]);
    };

    const addSession = () => {
        setSessionSetters([
            ...sessionSetters,
            { id_movie_theater: 0, starting_time: new Date(), ending_time: new Date() }
        ]);
    }

    const handleCreateSessions = () => {
        handleClosePopup();
        const sessions: SessionCreationDto[] = sessionSetters.map(sessionSetter => ({
            ...sessionSetter,
            id_movie: movieId,
        }));
        for (const session of sessions) {
            createSession(session);
        }
    };

    useEffect(() => {
        getMovieTheaters()
            .then((data) => {
                setMovieTheatersList(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        getSessionsByMovieId(movieId)
            .then((data) => {
                setSessions(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [movieId]);

    if (!movie) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <Button
                onClick={() => window.location.href = `/?${searchParams?.toString()}`}
                startIcon={<ArrowBackIcon style={{ color: 'white', width: '30px', height: '30px', justifySelf: 'center' }} />}
                style={{
                    position: 'fixed',
                    top: '10px',
                    left: '10px',
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'blue',
                    zIndex: 1000
                }}
            />
            <h1>{movie.title}</h1>
            <img src={movie.image} alt={movie.title} style={{ width: 'auto' }} />
            <p><strong>Release Date:</strong> {formatDate(movie.creation_date)}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Duration:</strong> {movie.duration} min</p>
            <p><strong>Description:</strong> {movie.synopsis}</p>

            <h2>Sessions</h2>
            {sessions.length === 0 && <p>No sessions available for this movie.</p>}
            {sessions.map((session => (
                <div>
                    <p><strong>Movie Theater:</strong> {movieTheatersList.find(theater => theater.id_movie_theater === session.id_movie_theater)?.name}</p>
                    <p><strong>Starting Time:</strong> {formatDate(session.starting_time)}</p>
                    <p><strong>Ending Time:</strong> {formatDate(session.ending_time)}</p>
                </div>
            )))}

            <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: '1rem' }}
                onClick={handleOpenPopup}
            >
                Add Sessions
            </Button>

            <Dialog open={isPopupOpen} onClose={handleClosePopup}>
                <DialogTitle>Publish Movie</DialogTitle>
                <DialogContent>
                    {sessionSetters.map((sessionSetter) => (
                        <>
                            <select
                                value={sessionSetter.id_movie_theater}
                                onChange={(e) => {
                                    setSessionSetters((prev) =>
                                        prev.map((setter) =>
                                            setter === sessionSetter
                                                ? { ...setter, movieTheater: Number(e.target.value) }
                                                : setter
                                        )
                                    );
                                }}
                            >
                                <option value={0}>Select City</option>
                                {movieTheatersList.map((movieTheater) => (
                                    <option key={movieTheater.id_movie_theater} value={movieTheater.id_movie_theater}>
                                        {movieTheater.name} ({movieTheater.address})
                                    </option>
                                ))}
                            </select>
                            <MyDatePicker date={sessionSetter.starting_time} changeDate={(e) => {
                                setSessionSetters((prev) =>
                                    prev.map((setter) =>
                                        setter === sessionSetter
                                            ? { ...setter, startingDate: e }
                                            : setter
                                    )
                                );
                            }} />
                            <MyDatePicker date={sessionSetter.ending_time} changeDate={(e) => {
                                setSessionSetters((prev) =>
                                    prev.map((setter) =>
                                        setter === sessionSetter
                                            ? { ...setter, endingDate: e }
                                            : setter
                                    )
                                );
                            }} />
                        </>
                    ))}
                    <Button onClick={addSession} variant="contained" color="primary">Add Session</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateSessions} color="primary">
                        Save
                    </Button>
                    <Button onClick={handleClosePopup} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Movie;