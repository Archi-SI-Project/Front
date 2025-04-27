import MovieDto from "./MovieDto";

export default function createMovieDto(data: any): MovieDto {
    const id = data["id"];
    const title = data["title"];
    const duration = data["duration"];
    const creation_date = data["creationDate"];
    const language = data["language"];
    const director = data["director"];
    const image = data["image"];
    const main_actors = data["mainActors"];
    const min_age = data["minAge"];
    const synopsis = data["synopsis"];
    const genre = data["genre"];
    const movie: MovieDto = {
        id: id,
        title: title,
        duration: duration,
        creation_date: new Date(creation_date),
        language: language,
        director: director,
        image: image,
        main_actors: main_actors,
        min_age: min_age,
        synopsis: synopsis,
        genre: genre,
    }
    return movie;
}