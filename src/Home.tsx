import React, { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField } from '@mui/material';
import './App.css';
import { addNewMovie, createMovie, getMovies, getMoviesWithFilter, getMovieTheaters } from './API';
import MovieDto, { MovieCreationDto } from './assets/MovieDto';
import MovieCard from './components/MovieCard';
import Header from './components/Header';
// import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import MovieTheaterDto from './assets/MovieTheaterDto';
import MyDatePicker from './components/MyDatePicker';
import { SessionDefinitionDto } from './assets/SessionDto';
import { globalVariable, isAdmin, setGlobalVariable } from './global';

const Home: React.FC = () => {
    const [moviesList, setMoviesList] = useState<MovieDto[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<MovieDto[]>([]);
    const [movieTheatersList, setMovieTheatersList] = React.useState<MovieTheaterDto[]>([]);
    const [city, setCity] = useState(() => new URLSearchParams(window.location.search).get('city') || '');
    const [sessionDate, setSessionDate] = useState(() => new URLSearchParams(window.location.search).get('sessionDate') || '');
    const [genre, setGenre] = useState(() => new URLSearchParams(window.location.search).get('genre') || '');
    const [duration, setDuration] = useState(() => new URLSearchParams(window.location.search).get('duration') || '');
    const [creationDate, setCreationDate] = useState(() => new URLSearchParams(window.location.search).get('date') || '');
    const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(window.location.search).get('searchTerm') || '');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
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
    // const sessionSetters = useMemo(() => [
    //     { movieTheater: "", startingTime: new Date(), endingTime: new Date() },
    // ], []);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setTextFieldTitle("");
        setTextFieldDuration("");
        setTextFieldCreationDate(new Date());
        setTextFieldLanguage("");
        setTextFieldDirector("");
        setTextFieldImage("");
        setTextFieldMainActors("");
        setTextFieldMinAge("");
        setTextFieldSynopsis("");
        setTextFieldGenre("");
        setSessionSetters([{ creationId: 0, idMovieTheater: 0, startingTime: new Date(), endingTime: new Date() }]);
    };

    const addSession = () => {
        setSessionSetters([
            ...sessionSetters,
            { creationId: sessionSetters.length, idMovieTheater: 0, startingTime: new Date(), endingTime: new Date() }
        ]);
    }

    const handleCreateMovie = () => {
        handleClosePopup();
        const movie: MovieCreationDto = {
            title: textFieldTitle,
            duration: parseInt(textFieldDuration),
            creationDate: (new Date(textFieldCreationDate)).toISOString().split('T')[0],
            language: textFieldLanguage,
            director: textFieldDirector,
            image: textFieldImage,
            mainActors: textFieldMainActors,
            minAge: parseInt(textFieldMinAge),
            synopsis: textFieldSynopsis,
            genre: textFieldGenre,
            subtitleLanguage: "EN",
        };
        const realSessionSetters = sessionSetters.slice(0, -1);
        addNewMovie(movie, realSessionSetters);
    };

    useEffect(() => {
        getMovies()
            .then((data) => {
                console.log(data);
                setMoviesList(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        getMoviesWithFilter(city, sessionDate, genre, duration, creationDate, searchTerm)
            .then((data) => {
                console.log(data);
                setFilteredMovies(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [moviesList, city, sessionDate, genre, duration, creationDate, searchTerm]);

    useEffect(() => {
        getMovieTheaters()
            .then((data) => {
                setMovieTheatersList(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const goToMoviePage = (movieId: number) => {
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (sessionDate) params.set('sessionDate', sessionDate);
        if (genre) params.set('genre', genre);
        if (duration) params.set('duration', duration);
        if (creationDate) params.set('date', creationDate);
        if (searchTerm) params.set('searchTerm', searchTerm);
        window.location.href = `/movie/${movieId}?${params.toString()}`;
    };

    const updateURL = () => {
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (sessionDate) params.set('sessionDate', sessionDate);
        if (genre) params.set('genre', genre);
        if (duration) params.set('duration', duration);
        if (creationDate) params.set('date', creationDate);
        if (searchTerm) params.set('searchTerm', searchTerm);
        window.history.replaceState({}, '', `?${params.toString()}`);
        window.dispatchEvent(new Event('changeparams'));
    };

    useEffect(() => {
        updateURL();
    }, [city, sessionDate, genre, duration, creationDate, searchTerm]);

    return (
        <div style={{ width: '100%', minWidth: '93vw', overflowY: 'auto' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, backgroundColor: 'white' }}>
                <Header
                    city={city}
                    setCity={setCity}
                    sessionDate={sessionDate}
                    setSessionDate={setSessionDate}
                    genre={genre}
                    setGenre={setGenre}
                    duration={duration}
                    setDuration={setDuration}
                    creationDate={creationDate}
                    setCreationDate={setCreationDate}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                    <h1 style={{ margin: 0, textAlign: 'center' }}>Movies</h1>
                    {isAdmin &&
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: '1rem' }}
                            onClick={handleOpenPopup}
                        >
                            Publish Movie
                        </Button>
                    }
                </div>
            </div>
            <div style={{ paddingTop: '150px' }} className="movie-list">
                <Grid container justifyContent="center" spacing={2}>
                    {filteredMovies.map((movie) => (
                        <Button
                            key={movie.id}
                            onClick={() => goToMoviePage(movie.id)}
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            <MovieCard movie={movie} />
                        </Button>
                    ))}
                </Grid>
            </div>

            <Dialog open={isPopupOpen} onClose={handleClosePopup}>
                <DialogTitle>Publish Movie</DialogTitle>
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
                    {sessionSetters.map((sessionSetter) => (
                        <>
                        <select
                            value={sessionSetter.idMovieTheater}
                            onChange={(e) => {
                                const updatedValue = Number(e.target.value);
                                setSessionSetters((prev) =>
                                    prev.map((setter) =>
                                        setter.creationId === sessionSetter.creationId
                                            ? { ...setter, idMovieTheater: updatedValue }
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
                    <Button onClick={handleCreateMovie} color="primary">
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

export default Home;