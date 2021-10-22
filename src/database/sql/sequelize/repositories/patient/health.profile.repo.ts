import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { HealthProfileDomainModel } from '../../../../../domain.types/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../../../../domain.types/patient/health.profile/health.profile.dto';
import { IHealthProfileRepo } from '../../../../repository.interfaces/patient/health.profile.repo.interface';
import { HealthProfileMapper } from '../../mappers/patient/health.profile.mapper';
import HealthProfile from '../../models/patient/health.profile.model';

///////////////////////////////////////////////////////////////////////

export class HealthProfileRepo implements IHealthProfileRepo {

    create = async (patientHealthProfileDomainModel: HealthProfileDomainModel)
    : Promise<HealthProfileDto> => {
        try {
            const entity = {
                PatientUserId      : patientHealthProfileDomainModel.PatientUserId,
                BloodGroup         : patientHealthProfileDomainModel.BloodGroup ?? '',
                MajorAilment       : patientHealthProfileDomainModel.MajorAilment ?? '',
                OtherConditions    : patientHealthProfileDomainModel.OtherConditions ?? '',
                IsDiabetic         : patientHealthProfileDomainModel.IsDiabetic ?? false,
                HasHeartAilment    : patientHealthProfileDomainModel.HasHeartAilment ?? false,
                MaritalStatus      : patientHealthProfileDomainModel.MaritalStatus ?? 'Unknown',
                Ethnicity          : patientHealthProfileDomainModel.Ethnicity ?? '',
                Nationality        : patientHealthProfileDomainModel.Nationality ?? '',
                Occupation         : patientHealthProfileDomainModel.Occupation ?? '',
                SedentaryLifestyle : patientHealthProfileDomainModel.SedentaryLifestyle ?? false,
                IsSmoker           : patientHealthProfileDomainModel.IsSmoker ?? false,
                SmokingSeverity    : patientHealthProfileDomainModel.SmokingSeverity ?? 'Low',
                SmokingSince       : patientHealthProfileDomainModel.SmokingSince ?? null,
                IsDrinker          : patientHealthProfileDomainModel.IsDrinker ?? false,
                DrinkingSeverity   : patientHealthProfileDomainModel.DrinkingSeverity ?? 'Low',
                DrinkingSince      : patientHealthProfileDomainModel.DrinkingSince ?? null,
                SubstanceAbuse     : patientHealthProfileDomainModel.SubstanceAbuse ?? false,
                ProcedureHistory   : patientHealthProfileDomainModel.ProcedureHistory ?? '',
                ObstetricHistory   : patientHealthProfileDomainModel.ObstetricHistory ?? '',
                OtherInformation   : patientHealthProfileDomainModel.OtherInformation ?? '',
            };
            const patientHealthProfile = await HealthProfile.create(entity);
            return HealthProfileMapper.toDto(patientHealthProfile);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByPatientUserId = async (patientUserId: string): Promise<HealthProfileDto> => {
        try {
            const patientHealthProfile = await HealthProfile.findOne({
                where : {
                    PatientUserId : patientUserId
                }
            });
            return HealthProfileMapper.toDto(patientHealthProfile);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateByPatientUserId = async (
        patientUserId: string,
        patientHealthProfileDomainModel: HealthProfileDomainModel)
        : Promise<HealthProfileDto> => {

        try {
            const patientHealthProfile = await HealthProfile.findOne({
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

            return HealthProfileMapper.toDto(patientHealthProfile);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            var result = await HealthProfile.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
