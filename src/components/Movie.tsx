import React, { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createSession, deleteMovie, getMovieById, getMovieTheaters, getSessionsByMovieId, updateMovie } from '../API';
import MovieDto, { MovieCreationDto } from '../assets/MovieDto';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { formatDate } from '../assets/utils';
import MyDatePicker from './MyDatePicker';
import MovieTheaterDto from '../assets/MovieTheaterDto';
import { SessionCreationDto, SessionDefinitionDto } from '../assets/SessionDto';
import { se } from 'react-day-picker/locale';
import { isAdmin } from '../global';

const Movie: React.FC = () => {
    const { movie_id } = useParams<{ movie_id: string }>()
    if (!movie_id) {
        return <div>Error: Movie ID is missing.</div>;
    }
    const movieId = parseInt(movie_id, 10);
    const [movie, setMovie] = useState<MovieDto>();
    const [movieTheatersList, setMovieTheatersList] = React.useState<MovieTheaterDto[]>([]);
    const [isSessionPopupOpen, setIsSessionPopupOpen] = useState(false);
    const [isModifyPopupOpen, setIsModifyPopupOpen] = useState(false);
    const [textFieldTitle, setTextFieldTitle] = useState<string>("");
    const [textFieldDuration, setTextFieldDuration] = useState<string>("");
    const [textFieldCreationDate, setTextFieldCreationDate] = useState<Date>(new Date());
    const [textFieldLanguage, setTextFieldLanguage] = useState<string>("");
    const [textFieldDirector, setTextFieldDirector] = useState<string>("");
    const [textFieldImage, setTextFieldImage] = useState<string>("");
    const [textFieldMainActors, setTextFieldMainActors] = useState<string>("");
    const [textFieldMinAge, setTextFieldMinAge] = useState<string>("");
    const [textFieldSynopsis, setTextFieldSynopsis] = useState<string>("");
    const [textFieldGenre, setTextFieldGenre] = useState<string>("");
    const [sessionSetters, setSessionSetters] = useState<SessionDefinitionDto[]>([{ creationId: 0, idMovieTheater: 0, startingTime: new Date(), endingTime: new Date() }]);
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

    const handleOpenSessionPopup = () => {
        setIsSessionPopupOpen(true);
    };

    const handleCloseSessionPopup = () => {
        setIsSessionPopupOpen(false);
        setSessionSetters([{ creationId: 0, idMovieTheater: 0, startingTime: new Date(), endingTime: new Date() }]);
    };

    const handleOpenModifyPopup = () => {
        setTextFieldTitle(movie?.title || "");
        setTextFieldDuration(movie?.duration?.toString() || "");
        console.log(movie?.creationDate);
        setTextFieldCreationDate(new Date(movie?.creationDate || ""));
        setTextFieldLanguage(movie?.language || "");
        setTextFieldDirector(movie?.director || "");
        setTextFieldImage(movie?.image || "");
        // setTextFieldMainActors(movie?.main_actors?.join(', ') || "");
        setTextFieldMainActors(movie?.mainActors || "");
        setTextFieldMinAge(movie?.minAge?.toString() || "");
        setTextFieldSynopsis(movie?.synopsis || "");
        setTextFieldGenre(movie?.genre || "");
        setIsModifyPopupOpen(true);
    };

    const handleCloseModifyPopup = () => {
        setIsModifyPopupOpen(false);
    };

    const addSession = () => {
        setSessionSetters([
            ...sessionSetters,
            { creationId: sessionSetters.length, idMovieTheater: 0, startingTime: new Date(), endingTime: new Date() }
        ]);
    }

    const handleCreateSessions = () => {
        handleCloseSessionPopup();
        const sessions: SessionCreationDto[] = sessionSetters.map(sessionSetter => ({
            ...sessionSetter,
            idMovie: movieId,
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
                console.log(data);
                setSessions(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [movieId]);

    const handleModifyMovie = () => {
        handleCloseModifyPopup();
        const movie: MovieDto = {
            id: movieId,
            title: textFieldTitle,
            duration: parseInt(textFieldDuration),
            creationDate: new Date(textFieldCreationDate),
            language: textFieldLanguage,
            director: textFieldDirector,
            image: textFieldImage,
            mainActors: textFieldMainActors,
            minAge: parseInt(textFieldMinAge),
            synopsis: textFieldSynopsis,
            genre: textFieldGenre,
            subtitleLanguage: "EN",
        };
        updateMovie(movieId, movie)
        .then(() => {
            // Recharge les infos du film après modification
            return getMovieById(movieId);
        })
        .then((data) => {
            setMovie(data);
        })
        .catch((error) => {
            console.error(error);
        });
    };

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
            <p><strong>Release Date:</strong> {formatDate(movie.creationDate)}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Duration:</strong> {movie.duration} min</p>
            <p><strong>Description:</strong> {movie.synopsis}</p>

            <h2>Sessions</h2>
            {sessions.length === 0 && <p>No sessions available for this movie.</p>}
            {sessions && sessions.map((session => (
                <div>
                    <p><strong>Movie Theater:</strong> {movieTheatersList.find(theater => theater.idMovieTheater === session.idMovieTheater)?.name}</p>
                    <p><strong>Starting Time:</strong> {formatDate(session.startingTime)}</p>
                    <p><strong>Ending Time:</strong> {formatDate(session.endingTime)}</p>
                    <p style={{ marginBottom: '40px' }}></p>
                </div>
            )))}

            {isAdmin &&
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: '1rem' }}
                    onClick={handleOpenSessionPopup}
                >
                    Add Sessions
                </Button>
            }

            {isAdmin && (
                <>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginLeft: '1rem' }}
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this movie?')) {
                                // Call API to delete the movie
                                // Assuming deleteMovieById is a function in your API module
                                deleteMovie(movieId)
                                    .then(() => {
                                        alert('Movie deleted successfully.');
                                        window.location.href = '/'; // Redirect to home page
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        alert('Failed to delete the movie.');
                                    });
                            }
                        }}
                    >
                        Delete Movie
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: '1rem' }}
                        onClick={handleOpenModifyPopup}
                    >
                        Modify Movie
                    </Button>
                </>
            )}

            <Dialog open={isSessionPopupOpen} onClose={handleCloseSessionPopup}>
                <DialogTitle>Add Sessions</DialogTitle>
                <DialogContent>
                    {sessionSetters.map((sessionSetter) => (
                        <>
                            <select
                                value={sessionSetter.idMovieTheater}
                                onChange={(e) => {
                                    setSessionSetters((prev) =>
                                        prev.map((setter) =>
                                            setter.creationId === sessionSetter.creationId
                                                ? { ...setter, idMovieTheater: Number(e.target.value) }
                                                : setter
                                        )
                                    );
                                }}
                            >
                                <option value={0}>Select City</option>
                                {movieTheatersList.map((movieTheater) => (
                                    <option key={movieTheater.idMovieTheater} value={movieTheater.idMovieTheater}>
                                        {movieTheater.name} ({movieTheater.address})
                                    </option>
                                ))}
                            </select>
                            <MyDatePicker date={sessionSetter.startingTime} changeDate={(e) => {
                                setSessionSetters((prev) =>
                                    prev.map((setter) =>
                                        setter.creationId === sessionSetter.creationId
                                            ? { ...setter, startingTime: e }
                                            : setter
                                    )
                                );
                            }} />
                            <MyDatePicker date={sessionSetter.endingTime} changeDate={(e) => {
                                setSessionSetters((prev) =>
                                    prev.map((setter) =>
                                        setter.creationId === sessionSetter.creationId
                                            ? { ...setter, endingTime: e }
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
                    <Button onClick={handleCloseSessionPopup} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isModifyPopupOpen} onClose={handleCloseModifyPopup}>
                <DialogTitle>Modify Movie</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="title"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={textFieldTitle}
                        onChange={(e) => {
                            setTextFieldTitle(e.target.value);
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="duration"
                        name="duration"
                        label="Duration"
                        type="text"
                        fullWidth
                        value={textFieldDuration}
                        onChange={(e) => {
                            setTextFieldDuration(e.target.value);
                        }}
                    />
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TextField
                            margin="dense"
                            id="creationDate"
                            name="creationDate"
                            label="Creation Date"
                            type="date"
                            fullWidth
                            value={textFieldCreationDate.toISOString().split('T')[0]}
                            onChange={(e) => {
                                setTextFieldCreationDate(new Date(e.target.value));
                            }}
                        />
                    </LocalizationProvider> */}
                    <MyDatePicker date={textFieldCreationDate} changeDate={setTextFieldCreationDate} />
                    {/* <DayPicker
                        mode="single"
                        selected={textFieldCreationDate}
                        onDayClick={(day: React.SetStateAction<Date>) => {
                            setTextFieldCreationDate(day);
                        }}
                    /> */}
                    <TextField
                        margin="dense"
                        id="language"
                        name="language"
                        label="Language"
                        type="text"
                        fullWidth
                        value={textFieldLanguage}
                        onChange={(e) => {
                            setTextFieldLanguage(e.target.value);
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="director"
                        name="director"
                        label="Director"
                        type="text"
                        fullWidth
                        value={textFieldDirector}
                        onChange={(e) => {
                            setTextFieldDirector(e.target.value);
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="image"
                        name="image"
                        label="Image"
                        type="text"
                        fullWidth
                        value={textFieldImage}
                        onChange={(e) => {
                            setTextFieldImage(e.target.value);
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="main actors"
                        name="main actors"
                        label="Main Actors"
                        type="text"
                        fullWidth
                        value={textFieldMainActors}
                        onChange={(e) => {
                            setTextFieldMainActors(e.target.value);
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="min age"
                        name="min age"
                        label="Min Age"
                        type="text"
                        fullWidth
                        value={textFieldMinAge}
                        onChange={(e) => {
                            setTextFieldMinAge(e.target.value);
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="synopsis"
                        name="synopsis"
                        label="Synopsis"
                        type="text"
                        fullWidth
                        value={textFieldSynopsis}
                        onChange={(e) => {
                            setTextFieldSynopsis(e.target.value);
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="genre"
                        name="genre"
                        label="Genre"
                        type="text"
                        fullWidth
                        value={textFieldGenre}
                        onChange={(e) => {
                            setTextFieldGenre(e.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModifyMovie} color="primary">
                        Save
                    </Button>
                    <Button onClick={handleCloseModifyPopup} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Movie;