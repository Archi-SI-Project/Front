export default interface MovieDto {
    id: number;
    title: string;
    duration: number;
    creationDate: string | Date;
    language: string;
    director: string;
    image: string;
    mainActors: string;
    minAge: number;
    synopsis: string;
    genre: string;
    subtitleLanguage: string;
};

export interface MovieCreationDto {
    title: string;
    duration: number;
    creationDate: string | Date;
    language: string;
    director: string;
    image: string;
    mainActors: string;
    minAge: number;
    synopsis: string;
    genre: string;
    subtitleLanguage: string;
}