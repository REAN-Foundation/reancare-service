import { UserDetailsDto, UserDto } from "../../../domain.types/user.domain.types";
import { PatientDomainModel, PatientDetailsDto, PatientDto, PatientSearchFilters } from "../../../domain.types/patient.domain.types";
import { IPatientRepo } from "../../../repository.interfaces/patient.repo.interface";
import { User } from '../models/user.model';
import { UserMapper } from "../mappers/user.mapper";
import { PatientMapper } from "../mappers/patient.mapper";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { Op } from "sequelize/types";

///////////////////////////////////////////////////////////////////////////////////

export class PatientRepo implements IPatientRepo {

    create = async (patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        try {
            var entity = {
                UserId: patientDomainModel.UserId,
                DisplayId: patientDomainModel.DisplayId,
                LastName: patientDomainModel.LastName,
                Phone: patientDomainModel.Phone,
                Email: patientDomainModel.Email ?? null,
                Gender: patientDomainModel.Gender ?? 'Unknown',
                BirthDate: patientDomainModel.BirthDate ?? null,
                ImageResourceId: patientDomainModel.ImageResourceId ?? null,
            };

            // var user = await User.create(entity);
            // var dto = await UserMapper.toDto(user);
            // return dto;
            return null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId(userId: string): Promise<PatientDetailsDto> {
        throw new Error("Method not implemented.");
    }
    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto> {
        throw new Error("Method not implemented.");
    }



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

    searchLight(filters: PatientSearchFilters): Promise<PatientDto[]> {
        throw new Error("Method not implemented.");
    }
    searchFull(filters: PatientSearchFilters): Promise<PatientDetailsDto[]> {
        throw new Error("Method not implemented.");
    }

}
