import { UserDetailsDto, UserDto } from "../../../domain.types/user.domain.types";
import { UserRoleRepo } from "../repositories/user.role.repo";
import User from '../models/user.model';
import { Helper } from '../../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////

export class UserMapper {

    static toDetailsDto = async (user: User): Promise<UserDetailsDto> => {

        if(user == null){
            return null;
        }

        var prefix = user.Prefix ? (user.Prefix + ' ') : '';
        var firstName = user.FirstName ? (user.FirstName + ' ') : '';
        const displayName:string = prefix + firstName + user.LastName ?? '';
        const age = Helper.getAgeFromBirthDate(user.BirthDate);

        var userRoleRepo = new UserRoleRepo();
        const userRoles = await userRoleRepo.getUserRoles(user.id);

        var dto: UserDetailsDto = {
            id: user.id,
            UserName: user.UserName,
            Prefix: user.Prefix,
            FirstName: user.FirstName,
            MiddleName: user.MiddleName,
            LastName: user.LastName,
            DisplayName: displayName,
            Gender: Helper.getGender(user.Gender),
            BirthDate: user.BirthDate,
            Age: age,
            Phone: user.Phone,
            Email: user.Email,
            ImageResourceId: user.ImageResourceId,
            ActiveSince: user.CreateAt,
            IsActive: user.IsActive,
            LastLogin: user.LastLogin,
            DefaultTimeZone:user.DefaultTimeZone,
            CurrentTimeZone:user.CurrentTimeZone,
            Roles: userRoles
        };
        return dto;
    }

    toDto = (user: User) => {

        if(user == null){
            return null;
        }
        
        var prefix = user.Prefix ? (user.Prefix + ' ') : '';
        var firstName = user.FirstName ? (user.FirstName + ' ') : '';
        const displayName:string = prefix + firstName + user.LastName ?? '';
        const age = Helper.getAgeFromBirthDate(user.BirthDate);

        var dto: UserDto = {
            id: user.id,
            DisplayName: displayName,
            Gender: Helper.getGender(user.Gender),
            BirthDate: user.BirthDate,
            Phone: user.Phone,
            Email: user.Email,
        };
        return dto;
    }
}