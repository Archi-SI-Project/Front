import MovieTheaterDto from "./MovieTheaterDto";

export default function createMovieTheaterDto(data: any): MovieTheaterDto {
    const id_movie_theater = data["idMovieTheater"];
    const city_id = data["cityId"];
    const address = data["address"];
    const name = data["name"];
    const movieTheater: MovieTheaterDto = {
        id_movie_theater: parseInt(id_movie_theater),
        city_id: parseInt(city_id),
        address: address,
        name: name,
    }
    return movieTheater;
}
