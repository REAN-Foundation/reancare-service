import { UserDto, UserDtoLight } from "../../../domain.types/user.domain.types";
import { PatientDomainModel, PatientDto } from "../../../domain.types/patient.domain.types";
import { IPatientRepo } from "../../../repository.interfaces/patient.repo.interface";
import { User } from '../models/user.model';
import { UserMapper } from "../mappers/user.mapper";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { Op } from "sequelize/types";

///////////////////////////////////////////////////////////////////////////////////

export class PatientRepo implements IPatientRepo {

    getByUserId(userId: string): Promise<PatientDto> {
        throw new Error("Method not implemented.");
    }
    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDto> {
        throw new Error("Method not implemented.");
    }

    create = async (createModel: PatientDomainModel): Promise<PatientDto> => {
        try {
            // var entity = {
            //     Prefix: userEntity.Prefix ?? '',
            //     FirstName: userEntity.FirstName,
            //     MiddleName: userEntity.MiddleName ?? null,
            //     LastName: userEntity.LastName,
            //     Phone: userEntity.Phone,
            //     Email: userEntity.Email ?? null,
            //     UserName: userEntity.UserName,
            //     Password: userEntity.Password ?? null,
            //     Gender: userEntity.Gender ?? 'Unknown',
            //     BirthDate: userEntity.BirthDate ?? null,
            //     ImageResourceId: userEntity.ImageResourceId ?? null,
            // };

            // var user = await User.create(entity);
            // var dto = await UserMapper.toDto(user);
            // return dto;
            return null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // getById = async (id: string): Promise<UserDto> => {
    //     try {
    //         var user = await User.findByPk(id);
    //         var dto = await UserMapper.toDto(user);
    //         return dto;
    //     } catch (error) {
    //         Logger.instance().log(error.message);
    //         throw new ApiError(500, error.message);
    //     }
    // };

    delete = async (userId: string): Promise<boolean> => {
        try {
            var user = await User.findByPk(userId);
            user.IsActive = false;
            await user.save();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    searchLight(filters: any): Promise<UserDtoLight[]> {
        throw new Error('Method not implemented.');
    }

    searchFull(filters: any): Promise<UserDto[]> {
        throw new Error('Method not implemented.');
    }

}
