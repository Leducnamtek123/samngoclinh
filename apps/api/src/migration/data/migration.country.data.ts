import { EnumAppEnvironment } from '@app/enums/app.enum';
import { CountryRequestDto } from '@modules/country/dtos/request/country.request.dto';

const countryData = [
    {
        name: 'Vietnam',
        alpha2Code: 'VN',
        alpha3Code: 'VNM',
        phoneCode: ['84'],
        continent: 'Asia',
        timezone: 'Asia/Ho_Chi_Minh',
    },
];

export const migrationCountryData: Record<
    EnumAppEnvironment,
    CountryRequestDto[]
> = {
    [EnumAppEnvironment.local]: countryData,
    [EnumAppEnvironment.development]: countryData,
    [EnumAppEnvironment.staging]: countryData,
    [EnumAppEnvironment.production]: countryData,
};
