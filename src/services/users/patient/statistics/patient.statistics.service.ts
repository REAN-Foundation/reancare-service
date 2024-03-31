
import { inject, injectable } from "tsyringe";
import * as fs from 'fs';
import { IMedicationConsumptionRepo } from "../../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IMedicationRepo } from "../../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IFoodConsumptionRepo } from "../../../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { IPhysicalActivityRepo } from "../../../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface";
import { IBodyWeightRepo } from "../../../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface";
import { ILabRecordRepo } from "../../../../database/repository.interfaces/clinical/lab.record/lab.record.interface";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { ISleepRepo } from "../../../../database/repository.interfaces/wellness/daily.records/sleep.repo.interface";
import { PatientDetailsDto } from "../../../../domain.types/users/patient/patient/patient.dto";
import { Helper } from "../../../../common/helper";
import { TimeHelper } from "../../../../common/time.helper";
import { PDFGenerator } from "../../../../modules/reports/pdf.generator";
import { IBloodPressureRepo } from "../../../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface";
import { IBloodGlucoseRepo } from "../../../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { IDailyAssessmentRepo } from "../../../../database/repository.interfaces/clinical/daily.assessment/daily.assessment.repo.interface";
import { IUserTaskRepo } from "../../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { ICareplanRepo } from "../../../../database/repository.interfaces/clinical/careplan.repo.interface";
import { IBodyHeightRepo } from "../../../../database/repository.interfaces/clinical/biometrics/body.height.repo.interface";
import { IPatientRepo } from "../../../../database/repository.interfaces/users/patient/patient.repo.interface";
import { IHealthProfileRepo } from "../../../../database/repository.interfaces/users/patient/health.profile.repo.interface";
import { addFooter, addTop } from "./stat.report.commons";
import { Logger } from "../../../../common/logger";
import { addBloodGlucoseStats, addBloodPressureStats, addBodyWeightStats, addCholStats, addLipidStats, createBiometricsCharts } from "./biometrics.stats";
import { createCalorieBalanceChart } from "./calorie.balance.stats";
import { createCareplanCharts } from "./careplan.stats";
import { addDailyAssessmentsStats, createDailyAssessentCharts } from "./daily.assessments.stats";
import { addExerciseStats, createPhysicalActivityCharts } from "./exercise.stats";
import { addCurrentMedications, addMedicationStats, createMedicationTrendCharts } from "./medication.stats";
import { addNutritionQuestionnaire, addNutritionServingsStats, createNutritionCharts } from "./nutrition.stats";
import { addSleepStats, createSleepTrendCharts } from "./sleep.stats";
import { addUserTasksStats, createUserTaskCharts } from "./user.tasks.stats";
import { addHealthJourney, addReportMetadata } from "./main.page";
import { IPersonRepo } from "../../../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../../../database/repository.interfaces/users/user/user.repo.interface";
import { addSummaryGraphs, createSummaryCharts } from "./summary.page";
import { DurationType } from "../../../../domain.types/miscellaneous/time.types";
import { IBloodOxygenSaturationRepo } from "../../../../database/repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface";
import { IPulseRepo } from "../../../../database/repository.interfaces/clinical/biometrics/pulse.repo.interface ";
import { IEmergencyEventRepo } from "../../../../database/repository.interfaces/clinical/emergency.event.repo.interface";
import { HealthSummaryDto } from "../../../../domain.types/statistics/custom.query/custom.query.dto";
import { CustomQueryMapper } from "../../../../database/sql/sequelize/mappers/statistics/custom.query.mapper";
import { BloodGlucoseDto } from "../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { BloodOxygenSaturationDto } from "../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
import { BloodPressureDto } from "../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { BodyHeightDto } from "../../../../domain.types/clinical/biometrics/body.height/body.height.dto";
import { BodyWeightDto } from "../../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { PulseDto } from "../../../../domain.types/clinical/biometrics/pulse/pulse.dto";
import { EmergencyEventDto } from "../../../../domain.types/clinical/emergency.event/emergency.event.dto";
import { LabRecordDto } from "../../../../domain.types/clinical/lab.record/lab.record/lab.record.dto";
import { MedicationDto } from "../../../../domain.types/clinical/medication/medication/medication.dto";
import { ReportFrequency, Settings } from "../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model";

////////////////////////////////////////////////////////////////////////////////////////////////////////
export const BODY_WEIGHT_SECTION_SIZE = 325;
export const BLOOD_GLUCOSE_SECTION_SIZE = 340;
export const BLOOD_PRESSURE_SECTION_SIZE = 394;
export const SLEEP_HISTORY_SECTION_SIZE = 274;
export const START_INDEX = 91;
export const SPACE_BEFORE_SECTION_HEAD = 15;
export const FOOTER_SIZE = 41;

@injectable()
export class PatientStatisticsService {

    constructor(
        @inject('IHealthProfileRepo') private _healthProfileRepo: IHealthProfileRepo,
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo,
        @inject('IPhysicalActivityRepo') private _physicalActivityRepo: IPhysicalActivityRepo,
        @inject('IBodyWeightRepo') private _bodyWeightRepo: IBodyWeightRepo,
        @inject('IBodyHeightRepo') private _bodyHeightRepo: IBodyHeightRepo,
        @inject('ILabRecordRepo') private _labRecordsRepo: ILabRecordRepo,
        @inject('ISleepRepo') private _sleepRepo: ISleepRepo,
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationRepo: IBloodOxygenSaturationRepo,
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
        @inject('IPulseRepo') private _pulseRepo: IPulseRepo,
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
        @inject('IDailyAssessmentRepo') private _dailyAssessmentRepo: IDailyAssessmentRepo,
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
        @inject('IEmergencyEventRepo') private _emergencyEventRepo: IEmergencyEventRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
    ) {
    }

    //#region Publics

    public getReportModel = (
        patient: PatientDetailsDto,
        stats: any,
        clientCode: string) => {

        Logger.instance().log(JSON.stringify(patient, null, 2));

        const timezone = patient.User?.DefaultTimeZone ?? '+05:30';
        const date = new Date();
        const patientName = patient.User.Person.DisplayName;
        const patientAge = Helper.getAgeFromBirthDate(patient.User.Person.BirthDate);
        var offsetMinutes = TimeHelper.getTimezoneOffsets(timezone, DurationType.Minute);
        const assessmentDate = TimeHelper.addDuration(date, offsetMinutes, DurationType.Minute);
        const dateObj = new Date(assessmentDate);
        const options: Intl.DateTimeFormatOptions = {
            day   : '2-digit',
            month : 'long',
            year  : 'numeric',
        };
        const reportDateStr = new Intl.DateTimeFormat('en-US', options).format(dateObj);
        Logger.instance().log(`Report Date:: ${reportDateStr}`);

        const race = patient.HealthProfile.Race ? patient.HealthProfile.Race : 'Unspecified';
        const ethnicity = patient.HealthProfile.Ethnicity ? patient.HealthProfile.Ethnicity : 'Unspecified';
        const tobacco = patient.HealthProfile.TobaccoQuestionAns === true ? 'Yes' : 'No';

        return {
            Name              : patientName,
            PatientUserId     : patient.User.id,
            DisplayId         : patient.DisplayId,
            Age               : patientAge,
            Gender            : patient.User.Person.Gender,
            BirthDate         : patient.User.Person.BirthDate.toLocaleDateString(),
            ImageResourceId   : patient.User.Person.ImageResourceId,
            ProfileImagePath  : null,
            ReportDate        : date,
            ReportDateStr     : reportDateStr,
            CurrentBodyWeight : stats.WeightStr,
            CurrentHeight     : stats.HeightStr,
            BodyMassIndex     : stats.BodyMassIndex,
            Race              : race,
            Ethnicity         : ethnicity,
            Tobacco           : tobacco,
            MaritalStatus     : patient.HealthProfile.MaritalStatus ?? 'Unspecified',
            Stats             : stats,
            ClientCode        : clientCode
        };
    };

    public getHealthSummary = async(patientUserId: uuid): Promise<HealthSummaryDto> => {
        const filter = {
            PatientUserId : patientUserId,
        };

        const healthSummary: HealthSummaryDto = {};

        const patientHealthProfile = await this._healthProfileRepo.getByPatientUserId(patientUserId);
        const healthProfileSummary = CustomQueryMapper.toHealthProfileSummaryDto(patientHealthProfile);
        if (healthProfileSummary){
            healthSummary.HealthProfile = healthProfileSummary;
        }
        
        const patientMedication = await this._medicationRepo.search(filter);
        if (patientMedication.TotalCount > 0) {
            const medicationSummary: MedicationDto[] = [];
            for (const medication of patientMedication.Items) {
                const dto = CustomQueryMapper.toMedicationSummaryDto(medication);
                medicationSummary.push(dto);
            }
            healthSummary.Medication = medicationSummary;
        }

        const patientBloodGlucose = await this._bloodGlucoseRepo.search(filter);
        if (patientBloodGlucose.TotalCount > 0) {
            const bloodGlucoseSummary: BloodGlucoseDto[] = [];
            for (const bloodGlucose of patientBloodGlucose.Items) {
                const dto = CustomQueryMapper.toBloodGlucoseSummaryDto(bloodGlucose);
                bloodGlucoseSummary.push(dto);
            }
            healthSummary.BloodGlucose = bloodGlucoseSummary;
        }

        const patientBloodOxygenSaturation =
        await this._bloodOxygenSaturationRepo.search(filter);
        if (patientBloodOxygenSaturation.TotalCount > 0) {
            const bloodOxygenSaturationSummary: BloodOxygenSaturationDto[] = [];
            for (const oxygenSaturation of patientBloodOxygenSaturation.Items) {
                const dto = CustomQueryMapper.toBloodOxygenSaturationSummaryDto(oxygenSaturation);
                bloodOxygenSaturationSummary.push(dto);
            }
            healthSummary.BloodOxygenSaturation = bloodOxygenSaturationSummary;
        }

        const patientBloodPressure = await this._bloodPressureRepo.search(filter);
        if (patientBloodPressure.TotalCount > 0) {
            const bloodPressureSummary: BloodPressureDto[] = [];
            for (const bloodPressure of patientBloodPressure.Items) {
                const dto = CustomQueryMapper.toBloodPressureSummaryDto(bloodPressure);
                bloodPressureSummary.push(dto);
            }
            healthSummary.BloodPressure = bloodPressureSummary;
        }

        const patientBodyHeight =  await this._bodyHeightRepo.search(filter);
        if (patientBodyHeight.TotalCount > 0) {
            const bodyHeightSummary: BodyHeightDto[] = [];
            for (const bodyHeight of patientBodyHeight.Items) {
                const dto = CustomQueryMapper.toBodyHeightSummaryDto(bodyHeight);
                bodyHeightSummary.push(dto);
            }
            healthSummary.BodyHeight = bodyHeightSummary;
        }
        
        const patientBodyWeight = await this._bodyWeightRepo.search(filter);
        if (patientBodyWeight.TotalCount > 0) {
            const bodyWeightSummary: BodyWeightDto[] = [];
            for (const bodyWeight of patientBodyWeight.Items) {
                const dto = CustomQueryMapper.toBodyWeightSummaryDto(bodyWeight);
                bodyWeightSummary.push(dto);
            }
            healthSummary.BodyWeight = bodyWeightSummary;
        }
        
        const patientPulse = await this._pulseRepo.search(filter);
        if (patientPulse.TotalCount > 0) {
            const pulseSummary: PulseDto[] = [];
            for (const pulse of patientPulse.Items) {
                const dto = CustomQueryMapper.toPulseSummaryDto(pulse);
                pulseSummary.push(dto);
            }
            healthSummary.Pulse = pulseSummary;
        }

        const patientLabRecord = await this._labRecordsRepo.search(filter);
        if (patientLabRecord.TotalCount > 0) {
            const labRecordSummary: LabRecordDto[] = [];
            for (const labRecord of patientLabRecord.Items) {
                const dto = CustomQueryMapper.toLabRecordSummaryDto(labRecord);
                labRecordSummary.push(dto);
            }
            healthSummary.LabRecord = labRecordSummary;
        }

        const patientEmergencyEvent = await this._emergencyEventRepo.search(filter);
        if (patientEmergencyEvent.TotalCount > 0) {
            const emergencyEventSummary: EmergencyEventDto[] = [];
            for (const emergencyEvent of patientEmergencyEvent.Items) {
                const dto = CustomQueryMapper.toEmergencyEventSummaryDto(emergencyEvent);
                emergencyEventSummary.push(dto);
            }
            healthSummary.EmergencyEvent = emergencyEventSummary;
        }
        
        return healthSummary;
    };

    public getPatientStats = async (patientUserId: uuid, reportSetting: Settings = {
        ReportFrequency             : ReportFrequency.Month,
        HealthJourney               : true,
        MedicationAdherence         : true,
        BodyWeight                  : true,
        BloodGlucose                : true,
        BloodPressure               : true,
        SleepHistory                : true,
        LabValues                   : true,
        ExerciseAndPhysicalActivity : true,
        FoodAndNutrition            : true,
        DailyTaskStatus             : true,
    }) => {
        
        const numDays = this.frequenctToDays(reportSetting.ReportFrequency);
        //Nutrition
        let nutrition = null;
        if (reportSetting.FoodAndNutrition) {
            const nutritionStats = await this._foodConsumptionRepo.getStats(patientUserId, numDays);
            nutrition = {
                Stats : nutritionStats,
            };
        }

        //Physical activity
        let physicalActivityTrend = null;
        if (reportSetting.ExerciseAndPhysicalActivity) {
            const exerciseStats = await this._physicalActivityRepo.getStats(patientUserId, numDays);
            physicalActivityTrend = {
                Stats : exerciseStats,
            };
        }

        //Body weight, Lab values
        const patient = await this._patientRepo.getByUserId(patientUserId);
        const user = await this._userRepo.getById(patient.UserId);
        const person = await this._personRepo.getById(user.PersonId);
        var countryCode = person.Phone.split("-")[0];

        /*if (countryCode === '+1' || countryCode === '+44'){
            const weight = weightStr.split("-")[1];
            weightStr = weight;
            weightUnits = 'lbs';
        } else {
            const weight = weightStr.split("-")[0];
            weightStr = weight;
            var weightUnits = 'Kg';
        }*/
        let currentBodyWeight = null;
        if (reportSetting.BodyWeight) {
            currentBodyWeight = await this._bodyWeightRepo.getRecent(patientUserId);
        }

        let biometrics = null;
        if (reportSetting.LabValues || reportSetting.BodyWeight || reportSetting.BloodPressure) {
            const stats =
            await this.getLabValueStats(patientUserId, countryCode, reportSetting.ReportFrequency);
       
            biometrics = {
                Stats : stats
            };
        }

        //BMI calculation
       
        let currentHeight = null;
        let heightUnits = 'cm';
        var weightUnits = 'Kg';
    
        const currentWeight = currentBodyWeight ? currentBodyWeight.BodyWeight : null;
        const heightDto = await this._bodyHeightRepo.getRecent(patientUserId);
        if (heightDto) {
            currentHeight = heightDto.BodyHeight;
            heightUnits = heightDto.Unit;
        }
        var { bmi, weightStr, heightStr } =
                Helper.calculateBMI(currentHeight, heightUnits, currentWeight, weightUnits);

        //Daily assessments
        /*let dailyAssessmentTrend = null;
        if (reportSetting.MoodAndSymptoms) {
            const dailyAssessmentsStats =
            await this._dailyAssessmentRepo.getStats(patientUserId, reportSetting.ReportFrequency);
            dailyAssessmentTrend = {
                Stats : dailyAssessmentsStats
            };
        }*/

        //Sleep trend
        let sleepTrend = null;
        if (reportSetting.SleepHistory) {
            const sleepStats = await this._sleepRepo.getStats(patientUserId, reportSetting.ReportFrequency);
            const sumSleepHours = sleepStats.reduce((acc, x) => acc + x.SleepDuration, 0);
            var i = 0;
            if (sleepStats.length > 0) {
                for await (var s of sleepStats) {
                    if (s.SleepDuration !== 0) {
                        i = i + 1;
                    }
                }
            }
            const averageSleepHours = sleepStats.length === 0 ? null : sumSleepHours / i;
            const averageSleepHoursStr = averageSleepHours ? averageSleepHours.toFixed(1) : null;
            sleepTrend = {
                Stats               : sleepStats,
                AverageForLastMonth : averageSleepHoursStr,
            };
        }

        //Medication trends
        let medicationTrend = null;
        if (reportSetting.MedicationAdherence) {
            const medsStats = await this._medicationConsumptionRepo.getStats(patientUserId, numDays);
            const currentMedications = await this._medicationRepo.getCurrentMedications(patientUserId);
            medicationTrend = {
                Stats              : medsStats,
                CurrentMedications : currentMedications,
            };
        }

        //User engagement
        let userTasksTrend = null;
        if (reportSetting.DailyTaskStatus) {
            const userTasksStats = await this._userTaskRepo.getStats(patientUserId, numDays);
            const userEngagementStats = await this._userTaskRepo.getUserEngagementStats(patientUserId, numDays);
            userTasksTrend = {
                UserTasksStats      : userTasksStats,
                UserEngagementStats : userEngagementStats
            };
        }

        //Health journey / Careplan stats
        let careplanStats = {
            Enrollment      : null,
            CurrentProgress : null,
        };
        if (reportSetting.HealthJourney) {
            
            const activeEnrollments = await this._careplanRepo.getPatientEnrollments(patientUserId, true);
            const careplanEnrollment = activeEnrollments.length > 0 ? activeEnrollments[0] : null;
            if (careplanEnrollment != null) {
                const start = careplanEnrollment.StartAt;
                const end = careplanEnrollment.EndAt;
                const current = new Date();
                let totalDays = TimeHelper.dayDiff(start, end);
                if (totalDays === 0) {
                    totalDays = 1;
                }
                const covered = TimeHelper.dayDiff(start, current);
                const percentageCompletion = covered / totalDays;
                careplanStats = {
                    Enrollment      : careplanEnrollment,
                    CurrentProgress : percentageCompletion,
                };
            }
        }

        const stats = {
            WeightStr        : weightStr,
            CountryCode      : countryCode,
            HeightStr        : heightStr,
            BodyMassIndex    : bmi,
            Nutrition        : nutrition,
            PhysicalActivity : physicalActivityTrend,
            Biometrics       : biometrics,
            Sleep            : sleepTrend,
            Medication       : medicationTrend,
            UserEngagement   : userTasksTrend,
            Careplan         : careplanStats,
        };

        return stats;
    };

    public generateReport = async (reportModel: any, reportSettings: Settings) => {
        return await this.generateReportPDF(reportModel, reportSettings);
    };
    //#endregion

    //#region Report

    private getLabValueStats = async (patientUserId: uuid, countryCode: string, frequency: ReportFrequency) => {

        const bloodPressureStats = await this._bloodPressureRepo.getStats(patientUserId, frequency);
        const bloodGlucoseStats = await this._bloodGlucoseRepo.getStats(patientUserId, frequency);
        const cholesterolStats = await this._labRecordsRepo.getStats(patientUserId, frequency);
        var bodyWeightStats = await this._bodyWeightRepo.getStats(patientUserId, frequency);

        //Body weight
        const startingBodyWeight = bodyWeightStats.length > 0 ?
            bodyWeightStats[bodyWeightStats.length - 1].BodyWeight : 0;
        const recentBodyWeight = await this._bodyWeightRepo.getRecent(patientUserId);
        const currentBodyWeight = recentBodyWeight ? recentBodyWeight.BodyWeight : 0;
        var totalBodyWeightChange = currentBodyWeight - startingBodyWeight;
        const sum = bodyWeightStats.reduce((acc, x) => acc + x.BodyWeight, 0);
        const averageBodyWeight = bodyWeightStats.length === 0 ? null : sum / bodyWeightStats.length;

        //Blood pressure
        var startingSystolic = bloodPressureStats.length > 0 ?
            bloodPressureStats[bloodPressureStats.length - 1].Systolic : 0;
        var startingDiastolic = bloodPressureStats.length > 0 ?
            bloodPressureStats[bloodPressureStats.length - 1].Diastolic : 0;
        const recentBloodPressure = await this._bloodPressureRepo.getRecent(patientUserId);
        const currentSystolic = recentBloodPressure ? recentBloodPressure.Systolic : 0;
        const currentDiastolic = recentBloodPressure ? recentBloodPressure.Diastolic : 0;
        var totalChangeSystolic = currentSystolic - startingSystolic;
        var totalChangeDiastolic = currentDiastolic - startingDiastolic;

        //Blood glucose
        var startingBloodGlucose = bloodGlucoseStats.length > 0 ?
            bloodGlucoseStats[bloodGlucoseStats.length - 1].BloodGlucose : 0;
        const recentBloodGlucose = await this._bloodGlucoseRepo.getRecent(patientUserId);
        const currentBloodGlucose = recentBloodGlucose ? recentBloodGlucose.BloodGlucose : 0;
        var totalBloodGlucoseChange = currentBloodGlucose - startingBloodGlucose;

        //Total cholesterol
        const recentChol = await this._labRecordsRepo.getRecent(patientUserId, 'Total Cholesterol');
        var startingTotalCholesterol = cholesterolStats.TotalCholesterol.length > 0 ?
            cholesterolStats.TotalCholesterol[cholesterolStats.TotalCholesterol.length - 1].PrimaryValue : 0;
        const currentTotalCholesterol = recentChol ? recentChol.PrimaryValue : 0;
        var lastMeasuredChol = recentChol ? recentChol.RecordedAt : null;
        var totalCholesterolChange = currentTotalCholesterol - startingTotalCholesterol;

        //HDL
        const startingHDL = cholesterolStats.HDL.length > 0 ?
            cholesterolStats.HDL[cholesterolStats.HDL.length - 1].PrimaryValue : 0;
        const recentHDL = await this._labRecordsRepo.getRecent(patientUserId, 'HDL');
        const currentHDL = recentHDL ? recentHDL.PrimaryValue : 0;
        const lastMeasuredHDL = recentHDL ? recentHDL.RecordedAt : null;
        var totalHDLChange = currentHDL - startingHDL;

        //LDL
        var startingLDL = cholesterolStats.LDL.length > 0 ?
            cholesterolStats.LDL[cholesterolStats.LDL.length - 1].PrimaryValue : 0;
        const recentLDL = await this._labRecordsRepo.getRecent(patientUserId, 'LDL');
        const currentLDL = recentLDL ? recentLDL.PrimaryValue : 0;
        const lastMeasuredLDL = recentLDL ? recentLDL.RecordedAt : null;
        const totalLDLChange = currentLDL - startingLDL;

        //Triglyceride
        var startingTriglycerideLevel = cholesterolStats.TriglycerideLevel.length > 0 ?
            cholesterolStats.TriglycerideLevel[cholesterolStats.TriglycerideLevel.length - 1].PrimaryValue : 0;
        const recentTrigy = await this._labRecordsRepo.getRecent(patientUserId, 'Triglyceride Level');
        const currentTriglycerideLevel = recentTrigy ? recentTrigy.PrimaryValue : 0;
        const lastMeasuredTrigly = recentTrigy ? recentTrigy.RecordedAt : null;
        const totalTriglycerideLevelChange = currentTriglycerideLevel - startingTriglycerideLevel;

        //A1CLevel
        var startingA1CLevel = cholesterolStats.A1CLevel.length > 0 ?
            cholesterolStats.A1CLevel[cholesterolStats.A1CLevel.length - 1].PrimaryValue : 0;
        const recentA1C = await this._labRecordsRepo.getRecent(patientUserId, 'A1C Level');
        const currentA1CLevel = recentA1C ? recentA1C.PrimaryValue : 0;
        const lastMeasuredA1C = recentA1C ? recentA1C.RecordedAt : null;
        const totalA1CLevelChange = currentA1CLevel - startingA1CLevel;

        //Lp(a)
        var startingLpa = cholesterolStats.Lipoprotein.length > 0 ?
            cholesterolStats.Lipoprotein[cholesterolStats.Lipoprotein.length - 1].PrimaryValue : 0;
        const recentLpa = await this._labRecordsRepo.getRecent(patientUserId, 'Lipoprotein');
        const currentLpa = recentLpa ? recentLpa.PrimaryValue : 0;
        const unit = recentLpa ? recentLpa.Unit : 'mg/dl';
        const lastMeasuredLpa = recentLpa ? recentLpa.RecordedAt : null;
        const totalLpaChange = currentLpa - startingLpa;

        return {
            BodyWeight : {
                History            : bodyWeightStats,
                CountryCode        : countryCode,
                AverageBodyWeight  : averageBodyWeight,
                StartingBodyWeight : startingBodyWeight,
                CurrentBodyWeight  : currentBodyWeight,
                TotalChange        : totalBodyWeightChange,
                LastMeasuredDate   : recentBodyWeight?.RecordDate ?? null,
            },
            BloodPressure : {
                History                        : bloodPressureStats,
                StartingSystolicBloodPressure  : startingSystolic,
                StartingDiastolicBloodPressure : startingDiastolic,
                CurrentBloodPressureDiastolic  : currentDiastolic,
                CurrentBloodPressureSystolic   : currentSystolic,
                TotalChangeSystolic            : totalChangeSystolic,
                TotalChangeDiastolic           : totalChangeDiastolic,
                LastMeasuredDate               : recentBloodPressure?.RecordDate ?? null,
            },
            BloodGlucose : {
                History              : bloodGlucoseStats,
                StartingBloodGlucose : startingBloodGlucose,
                CurrentBloodGlucose  : recentBloodGlucose ? recentBloodGlucose.BloodGlucose : null,
                TotalChange          : totalBloodGlucoseChange,
                LastMeasuredDate     : recentBloodGlucose?.RecordDate ?? null,
            },
            Lipids : {
                History          : cholesterolStats,
                TotalCholesterol : {
                    StartingTotalCholesterol : startingTotalCholesterol,
                    CurrentTotalCholesterol  : currentTotalCholesterol,
                    TotalCholesterolChange   : totalCholesterolChange,
                    LastMeasuredChol         : lastMeasuredChol,
                },
                HDL : {
                    StartingHDL     : startingHDL,
                    CurrentHDL      : currentHDL,
                    TotalHDLChange  : totalHDLChange,
                    LastMeasuredHDL : lastMeasuredHDL,
                },
                LDL : {
                    StartingLDL     : startingLDL,
                    CurrentLDL      : currentLDL,
                    TotalLDLChange  : totalLDLChange,
                    LastMeasuredLDL : lastMeasuredLDL,
                },
                TriglycerideLevel : {
                    StartingTriglycerideLevel    : startingTriglycerideLevel,
                    CurrentTriglycerideLevel     : currentTriglycerideLevel,
                    TotalTriglycerideLevelChange : totalTriglycerideLevelChange,
                    LastMeasuredTrigly           : lastMeasuredTrigly,
                },
                A1CLevel : {
                    StartingA1CLevel    : startingA1CLevel,
                    CurrentA1CLevel     : currentA1CLevel,
                    TotalA1CLevelChange : totalA1CLevelChange,
                    LastMeasuredA1C     : lastMeasuredA1C,
                },
                Lpa : {
                    StartingLpa     : startingLpa,
                    CurrentLpa      : currentLpa,
                    TotalLpaChange  : totalLpaChange,
                    LastMeasuredLpa : lastMeasuredLpa,
                    Unit            : unit
                }
            }
        };
    };

    private generateReportPDF = async (reportModel: any, reportSettings: Settings) => {
        const chartImagePaths = await this.generateChartImages(reportModel, reportSettings);
        return await this.exportReportToPDF(reportModel, chartImagePaths, reportSettings);
    };

    private exportReportToPDF = async (reportModel: any, chartImagePaths: any, reportSettings: Settings) => {
        try {
            var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('Health-history');
            var writeStream = fs.createWriteStream(absFilepath);
            const reportTitle = `Health History`;
            reportModel.ReportTitle = reportTitle;
            reportModel.ChartImagePaths = chartImagePaths;
            reportModel.Author = 'REAN Foundation';
            reportModel.TotalPages = 7;
            reportModel.HeaderImagePath = './assets/images/AHA_header_2.png';
            reportModel.FooterImagePath = './assets/images/AHA_footer_1.png';
            reportModel['ReportFrequency'] = reportSettings.ReportFrequency;
            var document = PDFGenerator.createDocument(reportTitle, reportModel.Author, writeStream);

            reportModel.TotalPages = 11;
            this.addMainPage(document, reportModel, reportSettings.HealthJourney);
            const isOptionsEnabled = reportSettings.LabValues ||
                                    reportSettings.SleepHistory ||
                                    reportSettings.MedicationAdherence ||
                                    reportSettings.BodyWeight ||
                                    reportSettings.FoodAndNutrition ||
                                    reportSettings.ExerciseAndPhysicalActivity;
            if (isOptionsEnabled) {
                this.addSummaryPage(document, reportModel, reportSettings);
            }
            
            if (reportSettings.LabValues) {
                this.addBiometricsPageC(document, reportModel);
                this.addBiometricsPageD(document, reportModel);
            }

            if (reportSettings.MedicationAdherence) {
                this.addMedicationPage(document, reportModel);
            }

            if (reportSettings.ExerciseAndPhysicalActivity) {
                this.addExercisePage(document, reportModel);
            }

            if (reportSettings.FoodAndNutrition) {
                this.addNutritionPageA(document, reportModel);
            }

            /*if (reportSettings.MoodAndSymptoms) {
                this.addDailyAssessmentPage(document, reportModel);
            }*/
            
            if  (reportSettings.DailyTaskStatus) {
                this.addUserEngagementPage(document, reportModel);
            }
            this.addHealthHistoryPage(document, reportModel, reportSettings);
                 
            this.setPageNumbers(document);
            document.end();

            const localFilePath = await PDFGenerator.savePDFLocally(writeStream, absFilepath);
            return { filename, localFilePath };
        }
        catch (error) {
            throw new Error(`Unable to generate assessment report! ${error.message}`);
        }
    };

    public generateChartImages = async (
        reportModel: any, reportSetting: Settings): Promise<any> => {

        const chartImagePaths = [];

        let imageLocations = await createSummaryCharts(reportModel.Stats, reportSetting);
        chartImagePaths.push(...imageLocations);

        if (reportSetting.FoodAndNutrition) {
            imageLocations = await createNutritionCharts(reportModel.Stats.Nutrition);
            chartImagePaths.push(...imageLocations);
        }
        
        if (reportSetting.ExerciseAndPhysicalActivity) {
            imageLocations = await createPhysicalActivityCharts(reportModel.Stats.PhysicalActivity);
            chartImagePaths.push(...imageLocations);
        }

        imageLocations = await createBiometricsCharts(reportModel.Stats.Biometrics, reportSetting);
        chartImagePaths.push(...imageLocations);
        if (reportSetting.SleepHistory) {
            imageLocations = await createSleepTrendCharts(reportModel.Stats.Sleep);
            chartImagePaths.push(...imageLocations);
        }
        if (reportSetting.MedicationAdherence) {
            imageLocations = await createMedicationTrendCharts(reportModel.Stats.Medication);
            chartImagePaths.push(...imageLocations);
        }

        /*if (reportSetting.MoodAndSymptoms) {
            imageLocations = await createDailyAssessentCharts(reportModel.Stats.DailyAssessent);
            chartImagePaths.push(...imageLocations);
        }*/
        
        if (reportSetting.DailyTaskStatus) {
            imageLocations = await createUserTaskCharts(reportModel.Stats.UserEngagement);
            chartImagePaths.push(...imageLocations);
        }
      
        if (reportSetting.HealthJourney) {
            imageLocations = await createCareplanCharts(reportModel.Stats.Careplan);
            chartImagePaths.push(...imageLocations);
        }
        
        imageLocations = await createCalorieBalanceChart(reportModel);
        chartImagePaths.push(...imageLocations);

        return chartImagePaths;
    };

    //#endregion

    //#region Pages

    private setPageNumbers = (document: PDFKit.PDFDocument) => {
        const pageRange: {
            start: number,
            count: number
        } = document.bufferedPageRange();
        for (let i = pageRange.start ; i < pageRange.count; i++ ) {
            document.switchToPage(i);
            PDFGenerator.addOrderPageNumber(document, i + 1, pageRange.count);
        }
        document.flushPages();
    };

    private addMainPage = (document, model, healthJourney: boolean) => {
        var y = addTop(document, model, null, false);
        y = addReportMetadata(document, model, y);
        // y = addReportSummary(document, model, y);
        if (healthJourney) {
            var clientList = ["HCHLSTRL", "REANPTNT"];
            if (clientList.indexOf(model.ClientCode) >= 0) {
                addHealthJourney(document, model, y);
            }
        }
        
        addFooter(document, "https://www.heart.org/", model.FooterImagePath);
    };

    private addSummaryPage = (document, model, reportSettings) => {
        var y = addTop(document, model, `Summary over Last ${Helper.frequencyToDays(reportSettings.ReportFrequency)}`);
        addSummaryGraphs(model, document, y, reportSettings);
        addFooter(document, '', model.FooterImagePath);
    };

    private addHealthHistoryPage = (document, model, reportSetting: Settings) => {
        const isOptionsEnabled = reportSetting.BodyWeight ||
                               reportSetting.BloodGlucose ||
                               reportSetting.BloodPressure ||
                               reportSetting.SleepHistory;

        if (isOptionsEnabled) {
            let y = addTop(document, model);
            addFooter(document, '', model.FooterImagePath);
            if (reportSetting.BodyWeight) {
                y = this.isPageEnd(y, document, model, 'BodyWeight');
                y = addBodyWeightStats(model, document, y);
            }
    
            if (reportSetting.BloodGlucose) {
                y = this.isPageEnd(y, document, model, 'BloodGlucose');
                if (y !== START_INDEX) {
                    y = y + SPACE_BEFORE_SECTION_HEAD;
                }
                y = addBloodGlucoseStats(model, document, y);
            }
    
            if (reportSetting.BloodPressure) {
                y = this.isPageEnd(y, document, model, 'BloodPressure');
                if (y !== START_INDEX) {
                    y = y + SPACE_BEFORE_SECTION_HEAD;
                }
                y = addBloodPressureStats(model, document, y);
            }
    
            if (reportSetting.SleepHistory) {
                y = this.isPageEnd(y, document, model, 'SleepHistory');
                if (y !== START_INDEX) {
                    y = y + SPACE_BEFORE_SECTION_HEAD;
                }
                y = addSleepStats(model, document, y);
            }
        }
        
    };

    private isPageEnd = (y: number, document: PDFKit.PDFDocument, model: any, context: string) => {
        if (context === 'BodyWeight') {
            if (y + BODY_WEIGHT_SECTION_SIZE > document.page.maxY() - FOOTER_SIZE) {
                y = addTop(document, model);
                addFooter(document, '', model.FooterImagePath);
                return y;
            }
        }
        
        if (context === 'BloodGlucose') {
            if (y + BLOOD_GLUCOSE_SECTION_SIZE > document.page.maxY() - FOOTER_SIZE) {
                y = addTop(document, model);
                addFooter(document, '', model.FooterImagePath);
                return y;
            }
        }

        if (context === 'BloodPressure') {
            if (y + BLOOD_PRESSURE_SECTION_SIZE > document.page.maxY() - FOOTER_SIZE) {
                y = addTop(document, model);
                addFooter(document, '', model.FooterImagePath);
                return y;
            }
        }

        if (context === 'SleepHistory') {
            if (y + SLEEP_HISTORY_SECTION_SIZE > document.page.maxY() - FOOTER_SIZE) {
                y = addTop(document, model);
                addFooter(document, '', model.FooterImagePath);
                return y;
            }
        }

        return y;
    };

    private addBiometricsPageC = (document, model) => {
        var y = addTop(document, model);
        addLipidStats(model, document, y);
        addFooter(document, '', model.FooterImagePath);
    };

    private addBiometricsPageD = (document, model) => {
        var y = addTop(document, model);
        addCholStats(model, document, y);
        addFooter(document, '', model.FooterImagePath);
    };

    private addMedicationPage = (document, model) => {
        var y = addTop(document, model);
        y = addMedicationStats(document, model, y);
        const currentMedications = model.Stats.Medication.CurrentMedications;
        addCurrentMedications(document, currentMedications, y);
        addFooter(document, '', model.FooterImagePath);
    };

    private addNutritionPageA = (document, model) => {
        var y = addTop(document, model);
        y = addNutritionQuestionnaire(document, model, y);
        addNutritionServingsStats(document, model, y);
        addFooter(document, '', model.FooterImagePath);
    };

    private addExercisePage = (document, model) => {
        var y = addTop(document, model);
        addExerciseStats(document, model, y);
        addFooter(document, '', model.FooterImagePath);
    };

    private addUserEngagementPage = (document, model) => {
        var y = addTop(document, model);
        addUserTasksStats(document, model, y);
        addFooter(document, '', model.FooterImagePath);
    };

    private addDailyAssessmentPage = (document, model) => {
        var y = addTop(document, model);
        addDailyAssessmentsStats(document, model, y);
        addFooter(document, '', model.FooterImagePath);
    };

    private frequenctToDays = (frequency: ReportFrequency): number => {
        if (frequency === ReportFrequency.Week) {
            return 7;
        }
        if (frequency === ReportFrequency.Month) {
            return 30;
        }
        if (frequency === ReportFrequency.SixMonth) {
            return 30 * 6;
        }
        if (frequency === ReportFrequency.Year) {
            return 365;
        }
    };
    //#endregion

}
