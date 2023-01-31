import { Helper } from '../../../../../common/helper';
import { Gender } from '../../../../../domain.types/miscellaneous/system.types';
import { PersonDetailsDto, PersonDto } from "../../../../../domain.types/person/person.dto";
import Person from '../../models/person/person.model';

///////////////////////////////////////////////////////////////////////////////////

export class PersonMapper {

    static toDetailsDto = async (person: Person): Promise<PersonDetailsDto> => {

        if (person == null){
            return null;
        }

        const displayName: string = Helper.constructPersonDisplayName(
            person.Prefix,
            person.FirstName,
            person.LastName
        );

        const age = Helper.getAgeFromBirthDate(person.BirthDate);

        const dto: PersonDetailsDto = {
            id                   : person.id,
            Prefix               : person.Prefix,
            FirstName            : person.FirstName,
            MiddleName           : person.MiddleName,
            LastName             : person.LastName,
            DisplayName          : displayName,
            Gender               : Gender[person.Gender] ?? 'Unknown',
            SelfIdentifiedGender : person.SelfIdentifiedGender,
            BirthDate            : person.BirthDate,
            Age                  : person.Age ?? age,
            Phone                : person.Phone,
            Email                : person.Email,
            TelegramChatId       : person.TelegramChatId,
            ImageResourceId      : person.ImageResourceId,
            ActiveSince          : person.CreatedAt,
            Roles                : [],
            Addresses            : []
        };
        return dto;
    };

    static toDto = (person: Person) => {

        if (person == null){
            return null;
        }

        const prefix = person.Prefix ? (person.Prefix + ' ') : '';
        const firstName = person.FirstName ? (person.FirstName + ' ') : '';
        const displayName:string = prefix + firstName + person.LastName ?? '';

        //const age = Helper.getAgeFromBirthDate(person.BirthDate);

        const dto: PersonDto = {
            id          : person.id,
            DisplayName : displayName,
            Gender      : person.Gender as Gender,
            BirthDate   : person.BirthDate,
            Phone       : person.Phone,
            Email       : person.Email,
        };
        return dto;
    };

}
