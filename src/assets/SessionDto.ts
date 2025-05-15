export default interface SessionDto {
    id: number;
    startingTime: Date;
    endingTime: Date;
    idMovie: number;
    idMovieTheater: number;
}

export interface SessionCreationDto {
    startingTime: Date;
    endingTime: Date;
    idMovie: number;
    idMovieTheater: number;
}

export interface SessionAddToDbDto {
    startingTime: Date;
    endingTime: Date;
    idMovie: {id: number};
    idMovieTheater: {id: number};
}

export interface SessionDefinitionDto {
    creationId: number;
    startingTime: Date;
    endingTime: Date;
    idMovieTheater: number;
}