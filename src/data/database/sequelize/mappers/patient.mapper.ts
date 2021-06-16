import { UserDomainModel, UserDto } from "../../../domain.types/user.domain.types";
import { UserRepo } from "../repositories/user.repo";
import { UserRoleRepo } from "../repositories/user.role.repo";
import { RoleRepo } from "../repositories/role.repo";
import { User } from '../models/user.model';
import { Patient } from '../models/patient.model';
import { Sequelize } from "sequelize/types";
import { Helper } from '../../../../common/helper';
import { NotThere } from '../../../../common/system.types';
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { UserRole } from "../models/user.role.model";
import { PatientDetailsDto, PatientDomainModel, PatientDto } from "../../../domain.types/patient.domain.types";
import { AddressRepo } from "../repositories/address.repo";

///////////////////////////////////////////////////////////////////////////////////

export class PatientMapper {

    static toUserDomainModel(patientDomainModel: PatientDomainModel): UserDomainModel {
        var userDomainModel: UserDomainModel = {
            Prefix: patientDomainModel.Prefix,
            FirstName: patientDomainModel.FirstName,
            MiddleName: patientDomainModel.MiddleName,
            LastName: patientDomainModel.LastName,
            Phone: patientDomainModel.Phone,
            Email: patientDomainModel.Email,
            BirthDate: patientDomainModel.BirthDate,
            Gender: patientDomainModel.Gender,
            ImageResourceId: patientDomainModel.ImageResourceId,
        };
        return userDomainModel;
    }

    static toDetailsDto = async (patient: Patient): Promise<PatientDetailsDto> => {

        if(patient == null){
            return null;
        }

        var userRepo = new UserRepo();
        const user = await userRepo.getById(patient.UserId);

        var addressRepo = new AddressRepo();
        const address = await addressRepo.getByUserId(user.id);

        var dto: PatientDetailsDto = {
            id: patient.id,
            UserId: user.id,
            DisplayId: patient.DisplayId,
            UserName: user.UserName,
            Prefix: user.Prefix,
            FirstName: user.FirstName,
            MiddleName: user.MiddleName,
            LastName: user.LastName,
            DisplayName: user.DisplayName,
            Gender: user.Gender,
            BirthDate: user.BirthDate,
            Age: user.Age,
            Phone: user.Phone,
            Email: user.Email,
            ImageResourceId: user.ImageResourceId,
            ActiveSince: user.ActiveSince,
            IsActive: user.IsActive,
            LastLogin: user.LastLogin,
            DefaultTimeZone: user.DefaultTimeZone,
            CurrentTimeZone: user.CurrentTimeZone,
            Address: address,
            MedicalProfile: null, //PatientMedicalProfileDto;
            Insurances: [], //PatientInsuranceDto[];
            EmergencyContacts: [], // PatientEmergencyContactDto[];
        };
        return dto;
    }

    static toDto = async (patient: Patient): Promise<PatientDto> => {

        if(patient == null){
            return null;
        }

        var userRepo = new UserRepo();
        const user = await userRepo.getById(patient.UserId);

        var dto: PatientDto = {
            id: user.id,
            DisplayId: patient.DisplayId,
            DisplayName: user.DisplayName,
            UserName: user.UserName,
            Phone: user.Phone,
            Email: user.Email,
            Gender: user.Gender,
            BirthDate: user.BirthDate,
            Age: user.Age,
        };
        return dto; 
    }
}