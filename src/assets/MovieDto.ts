export default interface MovieDto {
    id: number;
    title: string;
    duration: number;
    creation_date: Date;
    language: string;
    director: string;
    image: string;
    main_actors: string[];
    min_age: number;
    synopsis: string;
    genre: string;
};

export interface MovieCreationDto {
    title: string;
    duration: number;
    creation_date: Date;
    language: string;
    director: string;
    image: string;
    main_actors: string[];
    min_age: number;
    synopsis: string;
    genre: string;
}