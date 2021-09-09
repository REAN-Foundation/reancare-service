import { IPatientHealthProfileRepo } from '../../../repository.interfaces/patient.health.profile.repo.interface';
import PatientHealthProfile from '../models/patient.health.profile.model';
import { PatientHealthProfileMapper } from '../mappers/patient.health.profile.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';
import { PatientHealthProfileDomainModel } from '../../../../domain.types/patient.health.profile/patient.health.profile.domain.model';
import { PatientHealthProfileDto } from '../../../../domain.types/patient.health.profile/patient.health.profile.dto';

///////////////////////////////////////////////////////////////////////

export class PatientHealthProfileRepo implements IPatientHealthProfileRepo {

    create = async (patientHealthProfileDomainModel: PatientHealthProfileDomainModel)
    : Promise<PatientHealthProfileDto> => {
        try {
            const entity = {
                PatientUserId      : patientHealthProfileDomainModel.PatientUserId,
                BloodGroup         : patientHealthProfileDomainModel.BloodGroup ?? null,
                MajorAilment       : patientHealthProfileDomainModel.MajorAilment ?? null,
                OtherConditions    : patientHealthProfileDomainModel.OtherConditions ?? null,
                IsDiabetic         : patientHealthProfileDomainModel.IsDiabetic ?? false,
                HasHeartAilment    : patientHealthProfileDomainModel.HasHeartAilment ?? false,
                MaritalStatus      : patientHealthProfileDomainModel.MaritalStatus ?? 'Unknown',
                Ethnicity          : patientHealthProfileDomainModel.Ethnicity ?? null,
                Nationality        : patientHealthProfileDomainModel.Nationality ?? null,
                Occupation         : patientHealthProfileDomainModel.Occupation ?? null,
                SedentaryLifestyle : patientHealthProfileDomainModel.SedentaryLifestyle ?? false,
                IsSmoker           : patientHealthProfileDomainModel.IsSmoker ?? false,
                SmokingSeverity    : patientHealthProfileDomainModel.SmokingSeverity ?? 'Low',
                SmokingSince       : patientHealthProfileDomainModel.SmokingSince ?? null,
                IsDrinker          : patientHealthProfileDomainModel.IsDrinker ?? false,
                DrinkingSeverity   : patientHealthProfileDomainModel.DrinkingSeverity ?? 'Low',
                DrinkingSince      : patientHealthProfileDomainModel.DrinkingSince ?? null,
                SubstanceAbuse     : patientHealthProfileDomainModel.SubstanceAbuse ?? false,
                ProcedureHistory   : patientHealthProfileDomainModel.ProcedureHistory ?? null,
                ObstetricHistory   : patientHealthProfileDomainModel.ObstetricHistory ?? null,
                OtherInformation   : patientHealthProfileDomainModel.OtherInformation ?? null,
            };
            const patientHealthProfile = await PatientHealthProfile.create(entity);
            const dto = await PatientHealthProfileMapper.toDto(patientHealthProfile);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByPatientUserId = async (id: string): Promise<PatientHealthProfileDto> => {
        try {
            const patientHealthProfile = await PatientHealthProfile.findByPk(id);
            const dto = await PatientHealthProfileMapper.toDto(patientHealthProfile);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateByPatientUserId = async (
        patientUserId: string,
        patientHealthProfileDomainModel: PatientHealthProfileDomainModel)
        : Promise<PatientHealthProfileDto> => {

        try {
            const patientHealthProfile = await PatientHealthProfile.findOne({
                where : {
                    PatientUserId : patientUserId
                }
            });
            if (patientHealthProfile == null) {
                throw new Error("Cannot find health-profile for the patient.");
            }

            if (patientHealthProfileDomainModel.BloodGroup != null) {
                patientHealthProfile.BloodGroup = patientHealthProfileDomainModel.BloodGroup;
            }
            if (patientHealthProfileDomainModel.MajorAilment != null) {
                patientHealthProfile.MajorAilment = patientHealthProfileDomainModel.MajorAilment;
            }
            if (patientHealthProfileDomainModel.OtherConditions != null) {
                patientHealthProfile.OtherConditions = patientHealthProfileDomainModel.OtherConditions;
            }
            if (patientHealthProfileDomainModel.IsDiabetic != null) {
                patientHealthProfile.IsDiabetic = patientHealthProfileDomainModel.IsDiabetic;
            }
            if (patientHealthProfileDomainModel.HasHeartAilment != null) {
                patientHealthProfile.HasHeartAilment = patientHealthProfileDomainModel.HasHeartAilment;
            }
            if (patientHealthProfileDomainModel.MaritalStatus != null) {
                patientHealthProfile.MaritalStatus = patientHealthProfileDomainModel.MaritalStatus;
            }
            if (patientHealthProfileDomainModel.Ethnicity != null) {
                patientHealthProfile.Ethnicity = patientHealthProfileDomainModel.Ethnicity;
            }
            if (patientHealthProfileDomainModel.Nationality != null) {
                patientHealthProfile.Nationality = patientHealthProfileDomainModel.Nationality;
            }
            if (patientHealthProfileDomainModel.Occupation != null) {
                patientHealthProfile.Occupation = patientHealthProfileDomainModel.Occupation;
            }
            if (patientHealthProfileDomainModel.SedentaryLifestyle != null) {
                patientHealthProfile.SedentaryLifestyle = patientHealthProfileDomainModel.SedentaryLifestyle;
            }
            if (patientHealthProfileDomainModel.IsSmoker != null) {
                patientHealthProfile.IsSmoker = patientHealthProfileDomainModel.IsSmoker;
            }
            if (patientHealthProfileDomainModel.SmokingSeverity != null) {
                patientHealthProfile.SmokingSeverity = patientHealthProfileDomainModel.SmokingSeverity;
            }
            if (patientHealthProfileDomainModel.SmokingSince != null) {
                patientHealthProfile.SmokingSince = patientHealthProfileDomainModel.SmokingSince;
            }
            if (patientHealthProfileDomainModel.IsDrinker != null) {
                patientHealthProfile.IsDrinker = patientHealthProfileDomainModel.IsDrinker;
            }
            if (patientHealthProfileDomainModel.DrinkingSeverity != null) {
                patientHealthProfile.DrinkingSeverity = patientHealthProfileDomainModel.DrinkingSeverity;
            }
            if (patientHealthProfileDomainModel.DrinkingSince != null) {
                patientHealthProfile.DrinkingSince = patientHealthProfileDomainModel.DrinkingSince;
            }
            if (patientHealthProfileDomainModel.SubstanceAbuse != null) {
                patientHealthProfile.SubstanceAbuse = patientHealthProfileDomainModel.SubstanceAbuse;
            }
            if (patientHealthProfileDomainModel.ProcedureHistory != null) {
                patientHealthProfile.ProcedureHistory = patientHealthProfileDomainModel.ProcedureHistory;
            }
            if (patientHealthProfileDomainModel.ObstetricHistory != null) {
                patientHealthProfile.ObstetricHistory = patientHealthProfileDomainModel.ObstetricHistory;
            }
            if (patientHealthProfileDomainModel.OtherInformation != null) {
                patientHealthProfile.OtherInformation = patientHealthProfileDomainModel.OtherInformation;
            }

            await patientHealthProfile.save();

            const dto = await PatientHealthProfileMapper.toDto(patientHealthProfile);
            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            var result = await PatientHealthProfile.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
