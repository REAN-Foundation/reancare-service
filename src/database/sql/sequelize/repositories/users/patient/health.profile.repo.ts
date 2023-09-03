import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { HealthProfileDomainModel } from '../../../../../../domain.types/users/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../../../../../domain.types/users/patient/health.profile/health.profile.dto';
import { IHealthProfileRepo } from '../../../../../repository.interfaces/users/patient/health.profile.repo.interface';
import { HealthProfileMapper } from '../../../mappers/users/patient/health.profile.mapper';
import HealthProfile from '../../../models/users/patient/health.profile.model';

///////////////////////////////////////////////////////////////////////

export class HealthProfileRepo implements IHealthProfileRepo {

    create = async (model: HealthProfileDomainModel)
    : Promise<HealthProfileDto> => {
        try {
            const entity = {
                PatientUserId             : model.PatientUserId,
                BloodGroup                : model.BloodGroup ?? '',
                MajorAilment              : model.MajorAilment ?? '',
                OtherConditions           : model.OtherConditions ?? '',
                IsDiabetic                : model.IsDiabetic ?? null,
                HasHeartAilment           : model.HasHeartAilment ?? null,
                MaritalStatus             : model.MaritalStatus ?? 'Unknown',
                Ethnicity                 : model.Ethnicity ?? '',
                Race                      : model.Race ?? '',
                Nationality               : model.Nationality ?? '',
                Occupation                : model.Occupation ?? '',
                SedentaryLifestyle        : model.SedentaryLifestyle ?? false,
                IsSmoker                  : model.IsSmoker ?? false,
                SmokingSeverity           : model.SmokingSeverity ?? 'Low',
                SmokingSince              : model.SmokingSince ?? null,
                IsDrinker                 : model.IsDrinker ?? false,
                DrinkingSeverity          : model.DrinkingSeverity ?? 'Low',
                DrinkingSince             : model.DrinkingSince ?? null,
                SubstanceAbuse            : model.SubstanceAbuse ?? false,
                ProcedureHistory          : model.ProcedureHistory ?? '',
                ObstetricHistory          : model.ObstetricHistory ?? '',
                OtherInformation          : model.OtherInformation ?? '',
                TypeOfStroke              : model.TypeOfStroke ?? null,
                HasHighBloodPressure      : model.HasHighBloodPressure ?? null,
                HasHighCholesterol        : model.HasHighCholesterol ?? null,
                HasAtrialFibrillation     : model.HasAtrialFibrillation ?? null,
                TobaccoQuestion           : "Have you used tobacco products (such as cigarettes, electronic cigarettes, cigars, smokeless tobacco, or hookah) over the past year?",
                StrokeSurvivorOrCaregiver : model.StrokeSurvivorOrCaregiver ?? null,
                LivingAlone               : model.LivingAlone ?? null,
                WorkedPriorToStroke       : model.WorkedPriorToStroke ?? null

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
        model: HealthProfileDomainModel)
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
            if (model.BloodTransfusionDate !== undefined) {
                patientHealthProfile.BloodTransfusionDate = model.BloodTransfusionDate;
            }
            if (model.BloodDonationCycle !== undefined) {
                patientHealthProfile.BloodDonationCycle = model.BloodDonationCycle;
            }
            if (model.BloodGroup !== undefined) {
                patientHealthProfile.BloodGroup = model.BloodGroup;
            }
            if (model.MajorAilment !== undefined) {
                patientHealthProfile.MajorAilment = model.MajorAilment;
            }
            if (model.OtherConditions !== undefined) {
                patientHealthProfile.OtherConditions = model.OtherConditions;
            }
            if (model.IsDiabetic !== undefined) {
                patientHealthProfile.IsDiabetic = model.IsDiabetic;
            }
            if (model.HasHeartAilment !== undefined) {
                patientHealthProfile.HasHeartAilment = model.HasHeartAilment;
            }
            if (model.MaritalStatus !== undefined) {
                patientHealthProfile.MaritalStatus = model.MaritalStatus;
            }
            if (model.Ethnicity !== undefined) {
                patientHealthProfile.Ethnicity = model.Ethnicity;
            }
            if (model.Race !== undefined) {
                patientHealthProfile.Race = model.Race;
            }
            if (model.Nationality !== undefined) {
                patientHealthProfile.Nationality = model.Nationality;
            }
            if (model.Occupation !== undefined) {
                patientHealthProfile.Occupation = model.Occupation;
            }
            if (model.SedentaryLifestyle !== undefined) {
                patientHealthProfile.SedentaryLifestyle = model.SedentaryLifestyle;
            }
            if (model.IsSmoker !== undefined) {
                patientHealthProfile.IsSmoker = model.IsSmoker;
            }
            if (model.SmokingSeverity !== undefined) {
                patientHealthProfile.SmokingSeverity = model.SmokingSeverity;
            }
            if (model.SmokingSince !== undefined) {
                patientHealthProfile.SmokingSince = model.SmokingSince;
            }
            if (model.IsDrinker !== undefined) {
                patientHealthProfile.IsDrinker = model.IsDrinker;
            }
            if (model.DrinkingSeverity !== undefined) {
                patientHealthProfile.DrinkingSeverity = model.DrinkingSeverity;
            }
            if (model.DrinkingSince !== undefined) {
                patientHealthProfile.DrinkingSince = model.DrinkingSince;
            }
            if (model.SubstanceAbuse !== undefined) {
                patientHealthProfile.SubstanceAbuse = model.SubstanceAbuse;
            }
            if (model.ProcedureHistory !== undefined) {
                patientHealthProfile.ProcedureHistory = model.ProcedureHistory;
            }
            if (model.ObstetricHistory !== undefined) {
                patientHealthProfile.ObstetricHistory = model.ObstetricHistory;
            }
            if (model.OtherInformation !== undefined) {
                patientHealthProfile.OtherInformation = model.OtherInformation;
            }
            if (model.TobaccoQuestionAns !== undefined) {
                patientHealthProfile.TobaccoQuestionAns = model.TobaccoQuestionAns;
            }
            if (model.TypeOfStroke !== undefined) {
                patientHealthProfile.TypeOfStroke = model.TypeOfStroke;
            }
            if (model.HasHighBloodPressure !== undefined) {
                patientHealthProfile.HasHighBloodPressure = model.HasHighBloodPressure;
            }
            if (model.HasHighCholesterol !== undefined) {
                patientHealthProfile.HasHighCholesterol = model.HasHighCholesterol;
            }
            if (model.HasAtrialFibrillation !== undefined) {
                patientHealthProfile.HasAtrialFibrillation = model.HasAtrialFibrillation;
            }
            if (model.StrokeSurvivorOrCaregiver !== undefined) {
                patientHealthProfile.StrokeSurvivorOrCaregiver = model.StrokeSurvivorOrCaregiver;
            }
            if (model.LivingAlone !== undefined) {
                patientHealthProfile.LivingAlone = model.LivingAlone;
            }
            if (model.WorkedPriorToStroke !== undefined) {
                patientHealthProfile.WorkedPriorToStroke = model.WorkedPriorToStroke;
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
