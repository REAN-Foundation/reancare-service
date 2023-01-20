import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { HealthProfileDomainModel } from '../../../../../../domain.types/users/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../../../../../domain.types/users/patient/health.profile/health.profile.dto';
import { IHealthProfileRepo } from '../../../../../repository.interfaces/users/patient/health.profile.repo.interface';
import { HealthProfileMapper } from '../../../mappers/users/patient/health.profile.mapper';
import HealthProfile from '../../../models/users/patient/health.profile.model';

///////////////////////////////////////////////////////////////////////

export class HealthProfileRepo implements IHealthProfileRepo {

    create = async (patientHealthProfileDomainModel: HealthProfileDomainModel)
    : Promise<HealthProfileDto> => {
        try {
            const entity = {
                PatientUserId             : patientHealthProfileDomainModel.PatientUserId,
                BloodGroup                : patientHealthProfileDomainModel.BloodGroup ?? '',
                MajorAilment              : patientHealthProfileDomainModel.MajorAilment ?? '',
                OtherConditions           : patientHealthProfileDomainModel.OtherConditions ?? '',
                IsDiabetic                : patientHealthProfileDomainModel.IsDiabetic ?? null,
                HasHeartAilment           : patientHealthProfileDomainModel.HasHeartAilment ?? null,
                MaritalStatus             : patientHealthProfileDomainModel.MaritalStatus ?? 'Unknown',
                Ethnicity                 : patientHealthProfileDomainModel.Ethnicity ?? '',
                Race                      : patientHealthProfileDomainModel.Race ?? '',
                Nationality               : patientHealthProfileDomainModel.Nationality ?? '',
                Occupation                : patientHealthProfileDomainModel.Occupation ?? '',
                SedentaryLifestyle        : patientHealthProfileDomainModel.SedentaryLifestyle ?? false,
                IsSmoker                  : patientHealthProfileDomainModel.IsSmoker ?? false,
                SmokingSeverity           : patientHealthProfileDomainModel.SmokingSeverity ?? 'Low',
                SmokingSince              : patientHealthProfileDomainModel.SmokingSince ?? null,
                IsDrinker                 : patientHealthProfileDomainModel.IsDrinker ?? false,
                DrinkingSeverity          : patientHealthProfileDomainModel.DrinkingSeverity ?? 'Low',
                DrinkingSince             : patientHealthProfileDomainModel.DrinkingSince ?? null,
                SubstanceAbuse            : patientHealthProfileDomainModel.SubstanceAbuse ?? false,
                ProcedureHistory          : patientHealthProfileDomainModel.ProcedureHistory ?? '',
                ObstetricHistory          : patientHealthProfileDomainModel.ObstetricHistory ?? '',
                OtherInformation          : patientHealthProfileDomainModel.OtherInformation ?? '',
                TypeOfStroke              : patientHealthProfileDomainModel.TypeOfStroke ?? null,
                HasHighBloodPressure      : patientHealthProfileDomainModel.HasHighBloodPressure ?? null,
                HasHighCholesterol        : patientHealthProfileDomainModel.HasHighCholesterol ?? null,
                HasAtrialFibrillation     : patientHealthProfileDomainModel.HasAtrialFibrillation ?? null,
                TobaccoQuestion           : "Have you used tobacco products (such as cigarettes, electronic cigarettes, cigars, smokeless tobacco, or hookah) over the past year?",
                StrokeSurvivorOrCaregiver : patientHealthProfileDomainModel.StrokeSurvivorOrCaregiver ?? null,
                LivingAlone               : patientHealthProfileDomainModel.LivingAlone ?? null,
                WorkedPriorToStroke       : patientHealthProfileDomainModel.WorkedPriorToStroke ?? null

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
            if (patientHealthProfileDomainModel.BloodTransfusionDate !== undefined) {
                patientHealthProfile.BloodTransfusionDate = patientHealthProfileDomainModel.BloodTransfusionDate;
            }
            if (patientHealthProfileDomainModel.BloodDonationCycle !== undefined) {
                patientHealthProfile.BloodDonationCycle = patientHealthProfileDomainModel.BloodDonationCycle;
            }
            if (patientHealthProfileDomainModel.BloodGroup !== undefined) {
                patientHealthProfile.BloodGroup = patientHealthProfileDomainModel.BloodGroup;
            }
            if (patientHealthProfileDomainModel.MajorAilment !== undefined) {
                patientHealthProfile.MajorAilment = patientHealthProfileDomainModel.MajorAilment;
            }
            if (patientHealthProfileDomainModel.OtherConditions !== undefined) {
                patientHealthProfile.OtherConditions = patientHealthProfileDomainModel.OtherConditions;
            }
            if (patientHealthProfileDomainModel.IsDiabetic !== undefined) {
                patientHealthProfile.IsDiabetic = patientHealthProfileDomainModel.IsDiabetic;
            }
            if (patientHealthProfileDomainModel.HasHeartAilment !== undefined) {
                patientHealthProfile.HasHeartAilment = patientHealthProfileDomainModel.HasHeartAilment;
            }
            if (patientHealthProfileDomainModel.MaritalStatus !== undefined) {
                patientHealthProfile.MaritalStatus = patientHealthProfileDomainModel.MaritalStatus;
            }
            if (patientHealthProfileDomainModel.Ethnicity !== undefined) {
                patientHealthProfile.Ethnicity = patientHealthProfileDomainModel.Ethnicity;
            }
            if (patientHealthProfileDomainModel.Race !== undefined) {
                patientHealthProfile.Race = patientHealthProfileDomainModel.Race;
            }
            if (patientHealthProfileDomainModel.Nationality !== undefined) {
                patientHealthProfile.Nationality = patientHealthProfileDomainModel.Nationality;
            }
            if (patientHealthProfileDomainModel.Occupation !== undefined) {
                patientHealthProfile.Occupation = patientHealthProfileDomainModel.Occupation;
            }
            if (patientHealthProfileDomainModel.SedentaryLifestyle !== undefined) {
                patientHealthProfile.SedentaryLifestyle = patientHealthProfileDomainModel.SedentaryLifestyle;
            }
            if (patientHealthProfileDomainModel.IsSmoker !== undefined) {
                patientHealthProfile.IsSmoker = patientHealthProfileDomainModel.IsSmoker;
            }
            if (patientHealthProfileDomainModel.SmokingSeverity !== undefined) {
                patientHealthProfile.SmokingSeverity = patientHealthProfileDomainModel.SmokingSeverity;
            }
            if (patientHealthProfileDomainModel.SmokingSince !== undefined) {
                patientHealthProfile.SmokingSince = patientHealthProfileDomainModel.SmokingSince;
            }
            if (patientHealthProfileDomainModel.IsDrinker !== undefined) {
                patientHealthProfile.IsDrinker = patientHealthProfileDomainModel.IsDrinker;
            }
            if (patientHealthProfileDomainModel.DrinkingSeverity !== undefined) {
                patientHealthProfile.DrinkingSeverity = patientHealthProfileDomainModel.DrinkingSeverity;
            }
            if (patientHealthProfileDomainModel.DrinkingSince !== undefined) {
                patientHealthProfile.DrinkingSince = patientHealthProfileDomainModel.DrinkingSince;
            }
            if (patientHealthProfileDomainModel.SubstanceAbuse !== undefined) {
                patientHealthProfile.SubstanceAbuse = patientHealthProfileDomainModel.SubstanceAbuse;
            }
            if (patientHealthProfileDomainModel.ProcedureHistory !== undefined) {
                patientHealthProfile.ProcedureHistory = patientHealthProfileDomainModel.ProcedureHistory;
            }
            if (patientHealthProfileDomainModel.ObstetricHistory !== undefined) {
                patientHealthProfile.ObstetricHistory = patientHealthProfileDomainModel.ObstetricHistory;
            }
            if (patientHealthProfileDomainModel.OtherInformation !== undefined) {
                patientHealthProfile.OtherInformation = patientHealthProfileDomainModel.OtherInformation;
            }
            if (patientHealthProfileDomainModel.TobaccoQuestionAns !== undefined) {
                patientHealthProfile.TobaccoQuestionAns = patientHealthProfileDomainModel.TobaccoQuestionAns;
            }
            if (patientHealthProfileDomainModel.TypeOfStroke !== undefined) {
                patientHealthProfile.TypeOfStroke = patientHealthProfileDomainModel.TypeOfStroke;
            }
            if (patientHealthProfileDomainModel.HasHighBloodPressure !== undefined) {
                patientHealthProfile.HasHighBloodPressure = patientHealthProfileDomainModel.HasHighBloodPressure;
            }
            if (patientHealthProfileDomainModel.HasHighCholesterol !== undefined) {
                patientHealthProfile.HasHighCholesterol = patientHealthProfileDomainModel.HasHighCholesterol;
            }
            if (patientHealthProfileDomainModel.HasAtrialFibrillation !== undefined) {
                patientHealthProfile.HasAtrialFibrillation = patientHealthProfileDomainModel.HasAtrialFibrillation;
            }
            if (patientHealthProfileDomainModel.StrokeSurvivorOrCaregiver !== undefined) {
                patientHealthProfile.StrokeSurvivorOrCaregiver = patientHealthProfileDomainModel.StrokeSurvivorOrCaregiver;
            }
            if (patientHealthProfileDomainModel.LivingAlone !== undefined) {
                patientHealthProfile.LivingAlone = patientHealthProfileDomainModel.LivingAlone;
            }
            if (patientHealthProfileDomainModel.WorkedPriorToStroke !== undefined) {
                patientHealthProfile.WorkedPriorToStroke = patientHealthProfileDomainModel.WorkedPriorToStroke;
            }

            await patientHealthProfile.save();

            return HealthProfileMapper.toDto(patientHealthProfile);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteByPatientUserId = async (patientUserId: string): Promise<boolean> => {
        try {
            var result = await HealthProfile.destroy({ where: { PatientUserId: patientUserId } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
