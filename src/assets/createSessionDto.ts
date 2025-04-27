import SessionDto from "./SessionDto";

export default function createSessionDto(data: any): SessionDto {
    const id = data["id"];
    const starting_time = new Date(data["startingTime"]);
    const ending_time = new Date(data["endingTime"]);
    const id_movie = data["idMovie"];
    const id_movie_theater = data["idMovieTheater"];
    const session: SessionDto = {
        id: parseInt(id),
        starting_time: starting_time,
        ending_time: ending_time,
        id_movie: id_movie,
        id_movie_theater: id_movie_theater,
    };
    return session;
}
