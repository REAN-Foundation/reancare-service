import { DoctorDomainModel } from '../../../../domain.types/users/doctor/doctor.domain.model';
import { UserDomainModel } from '../../../../domain.types/users/user/user.domain.model';
import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';
import { AddressDomainModel } from "../../../../domain.types/general/address/address.domain.model";
import { Helper } from "../../../../common/helper";

import path from 'path';

///////////////////////////////////////////////////////////////////////////////////

export class DoctorMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'doctor.domain.model.json');
        var obj = Helper.jsonToObj(jsonPath);

        var a = obj.Addresses[0];
        var address: AddressDomainModel = {
            Type        : a.Type ? a.Type.toLowerCase() : 'official',
            AddressLine : a.AddressLine ?? '',
            City        : a.City ?? '',
            District    : a.District ?? '',
            State       : a.State ?? '',
            Country     : a.Country ?? '',
            PostalCode  : a.PostalCode ?? ''
        };

        var person: PersonDomainModel = {
            Prefix     : obj.User.Person.Prefix,
            FirstName  : obj.User.Person.FirstName,
            MiddleName : obj.User.Person.MiddleName,
            LastName   : obj.User.Person.LastName,
            Phone      : obj.User.Person.Phone,
            Email      : obj.User.Person.Email,
            Gender     : obj.User.Person.Gender,
            BirthDate  : obj.User.Person.BirthDate
        };

        var user: UserDomainModel = {
            Person : person
        };

        var model: DoctorDomainModel = {
            User      : user,
            Addresses : [address]
        };

        return model;
    };

}
