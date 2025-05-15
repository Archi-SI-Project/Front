import React from 'react';
import { formatDate } from '../assets/utils';
import { Button } from '@mui/material';

type MovieCardProps = {
    movie: {
        title: string;
        duration: number;
        creationDate: string | Date;
        image: string;
    };
};

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    return (
        <div style={{
            width: '200px',
            height: '500px',
            overflow: 'hidden',
            color: 'black',
            textTransform: 'none',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            <h2 style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                textAlign: 'center',
                // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                padding: '10px'
            }}>
                {movie.title}
            </h2>
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                <img
                    src={movie.image}
                    alt={movie.title}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }} 
                />
            </div>
            <p style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                textAlign: 'center',
                // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                padding: '10px'
            }}>
                {new Date(movie.creationDate)?.getFullYear()} - {movie.duration}min
            </p>
        </div>
    );
};

export default MovieCard;