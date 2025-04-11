export default interface SessionDto {
    id: number;
    starting_time: Date;
    ending_time: Date;
    id_movie: number;
    id_movie_theater: number;
}

export interface SessionCreationDto {
    starting_time: Date;
    ending_time: Date;
    id_movie: number;
    id_movie_theater: number;
}

export interface SessionDefinitionDto {
    starting_time: Date;
    ending_time: Date;
    id_movie_theater: number;
}