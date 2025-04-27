import CityDto from "./CityDto";

export default function createCityDto(data: any): CityDto {
    const name = data["name"];
    const postalCode = data["postalCode"];
    const city: CityDto = {
        name: name,
        postalCode: postalCode,
    };
    return city;
}