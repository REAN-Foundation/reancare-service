import { PatientDomainModel, PatientDetailsDto, PatientDto, PatientSearchFilters } from "../../../domain.types/patient.domain.types";
import { IPatientRepo } from "../../../repository.interfaces/patient.repo.interface";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import Patient from "../models/patient.model";
import { PatientMapper } from "../mappers/patient.mapper";
import User from "../models/user.model";

///////////////////////////////////////////////////////////////////////////////////

export class PatientRepo implements IPatientRepo {

    create = async (patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        try {
            var entity = {
                UserId: patientDomainModel.UserId,
                DisplayId: patientDomainModel.DisplayId,
                NationalHealthId: patientDomainModel.NationalHealthId,
                MedicalProfileId: patientDomainModel.MedicalProfileId,
                EhrId: patientDomainModel.EhrId
            };
            var patient = await Patient.create(entity);
            var dto = await PatientMapper.toDetailsDto(patient);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId = async (userId: string): Promise<PatientDetailsDto> => {
        try {
            var patient = await Patient.findOne({where: {UserId: userId}});
            var dto = await PatientMapper.toDetailsDto(patient);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    updateByUserId = async (userId: string, patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        try {
            var patient = await Patient.findOne({where: {UserId: userId}});
            if(patientDomainModel.Prefix != null) {
                patient.NationalHealthId = patientDomainModel.NationalHealthId;
            }            
            var dto = await PatientMapper.toDetailsDto(patient);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    search(filters: PatientSearchFilters): Promise<PatientDto[]> {
        throw new Error("Method not implemented.");
    }
    
    searchFull(filters: PatientSearchFilters): Promise<PatientDetailsDto[]> {
        throw new Error("Method not implemented.");
    }

}
