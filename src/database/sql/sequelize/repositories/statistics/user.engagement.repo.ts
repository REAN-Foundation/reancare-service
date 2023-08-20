import { Logger } from "../../../../../common/logger";
import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { IUserEngagementRepo } from "../../../../repository.interfaces/statistics/user.engagement.repo.interface";
import FoodConsumption from "../../models/wellness/nutrition/food.consumption.model";
import WaterConsumption from "../../models/wellness/nutrition/water.consumption.model";
import Assessment from "../../models/clinical/assessment/assessment.model";
import CareplanActivity from "../../models/clinical/careplan/careplan.activity.model";
import MedicationConsumption from "../../models/clinical/medication/medication.consumption.model";
import BloodCholesterol from "../../models/clinical/biometrics/blood.cholesterol.model";
import BloodGlucose from "../../models/clinical/biometrics/blood.glucose.model";
import BloodPressure from "../../models/clinical/biometrics/blood.pressure.model";
import BodyTemperature from "../../models/clinical/biometrics/body.temperature.model";
import BodyWeight from "../../models/clinical/biometrics/body.weight.model";
import Pulse from "../../models/clinical/biometrics/pulse.model";
import HowDoYouFeel from "../../models/clinical/daily.assessment/daily.assessment.model";
import SymptomAssessment from "../../models/clinical/symptom/symptom.assessment.model";
import UserTask from "../../models/users/user/user.task.model";
import Notice from "../../models/general/notice/notice.model";
import LabRecord from "../../models/clinical/lab.record/lab.record.model";
import HealthProfile from "../../models/users/patient/health.profile.model";
import NutritionQuestionnaire from "../../models/wellness/nutrition/nutrition.questionnaire.model";
import PhysicalActivity from "../../models/wellness/exercise/physical.activity.model";
import Meditation from "../../models/wellness/exercise/meditation.model";
import Sleep from "../../models/wellness/daily.records/sleep.model";
import StepCount from "../../models/wellness/daily.records/step.count.model";
import UserLearning from "../../models/educational/learning/user.learning.model";
import Chat from "../../models/community/chat/chat.message.model";
import User from "../../models/users/user/user.model";
import UserEngagement from "../../models/statistics/user.engagement.model";
import { TimeHelper } from "../../../../../common/time.helper";
import { DurationType } from "../../../../../domain.types/miscellaneous/time.types";
import { Op } from "sequelize";
import { UserEngagementCategories } from "../../../../../domain.types/statistics/user.engagement.types";
import sequelize from "sequelize";
import AssessmentQueryResponse from "../../models/clinical/assessment/assessment.query.response.model";

////////////////////////////////////////////////////////////////////////////////////////////

export class UserEngagementRepo implements IUserEngagementRepo {

    //#region Public

    public getUserEngagementStatsByYear = async (): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsByQuarter = async (): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsByMonth = async (): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsByWeek = async (): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsByDateRange = async (from: string, to: string): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsForUser = async (userId: uuid): Promise<any> => {
        return null;
    };

    public recordUserEngagementsForDay = async (): Promise<any> => {
        try {
            await this.recordUserEngagementsForDay_Nutrition();
            await this.recordUserEngagementsForDay_Medication();
            await this.recordUserEngagementsForDay_Careplan();
            await this.recordUserEngagementsForDay_Assessment();
            await this.recordUserEngagementsForDay_Vitals();
            await this.recordUserEngagementsForDay_LabRecords();
            await this.recordUserEngagementsForDay_Symptom();
            await this.recordUserEngagementsForDay_Educational();
            await this.recordUserEngagementsForDay_Chat();
            await this.recordUserEngagementsForDay_Appointment();
            await this.recordUserEngagementsForDay_Task();
            await this.recordUserEngagementsForDay_Goal();
            await this.recordUserEngagementsForDay_Newsfeed();
            await this.recordUserEngagementsForDay_Profile();
            await this.recordUserEngagementsForDay_Notice();
            await this.recordUserEngagementsForDay_Form();
            await this.recordUserEngagementsForDay_Survey();

            //await this.recordUserEngagementsForDay_Overall();
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    //#endregion

    //#region Private methods

    private getSubquery = (model: string) => {
        const query = `(
            SELECT id
            FROM "{{MODEL}}" AS subquery
            WHERE "{{MODEL}}"."PatientUserId" = subquery."PatientUserId"
            ORDER BY "CreatedAt" DESC
            LIMIT 1
          )`;
        return query.replace("{{MODEL}}", model);
    };

    private recordUserEngagementsForDay_Nutrition = async () => {
        try {
            const todayStartUtc = TimeHelper.startOfTodayUtc();
            const fromUtc = TimeHelper.subtractDuration(todayStartUtc, 1, DurationType.Day);
            const toUtc = todayStartUtc;

            var sq = this.getSubquery("FoodConsumption");

            const foodConsumptions = await FoodConsumption.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : FoodConsumption.sequelize.literal(sq) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of foodConsumptions) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.Nutrition,
                    RecordName      : 'FoodConsumption',
                    AdditionalInfo  : c.Food,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }

            var sq = this.getSubquery("WaterConsumption");
            const waterConsumptions = await WaterConsumption.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : WaterConsumption.sequelize.literal(sq)
                    }
                }
            });
            for await (const c of waterConsumptions) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.Nutrition,
                    RecordName      : 'WaterConsumption',
                    AdditionalInfo  : c.Volume,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Medication = async () => {
        try {
            const todayStartUtc = TimeHelper.startOfTodayUtc();
            const fromUtc = TimeHelper.subtractDuration(todayStartUtc, 1, DurationType.Day);
            const toUtc = todayStartUtc;

            const query = `(
                SELECT id
                FROM "MedicationConsumption" AS subquery
                WHERE "MedicationConsumption"."PatientUserId" = subquery."PatientUserId"
                ORDER BY "TakenAt" DESC
                LIMIT 1
              )`;

            const medicationConsumptions = await MedicationConsumption.findAll({
                where : {
                    TakenAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : MedicationConsumption.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of medicationConsumptions) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.Medication,
                    RecordName      : 'MedicationConsumption',
                    AdditionalInfo  : c.DrugName,
                    RecordTimestamp : c.TakenAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Careplan = async () => {
        try {
            const todayStartUtc = TimeHelper.startOfTodayUtc();
            const fromUtc = TimeHelper.subtractDuration(todayStartUtc, 1, DurationType.Day);
            const toUtc = todayStartUtc;

            const query = `(
                SELECT id
                FROM "CareplanActivity" AS subquery
                WHERE "CareplanActivity"."PatientUserId" = subquery."PatientUserId"
                ORDER BY "CompletedAt" DESC
                LIMIT 1
              )`;

            const careplanActivities = await CareplanActivity.findAll({
                where : {
                    CompletedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : CareplanActivity.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of careplanActivities) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.Careplan,
                    RecordName      : 'CareplanActivity',
                    AdditionalInfo  : c.Category,
                    RecordTimestamp : c.CompletedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Assessment = async () => {
        try {
            const todayStartUtc = TimeHelper.startOfTodayUtc();
            const fromUtc = TimeHelper.subtractDuration(todayStartUtc, 1, DurationType.Day);
            const toUtc = todayStartUtc;

            const query = `(
                SELECT "id"
                FROM "AssessmentQueryResponse"
                WHERE "AssessmentQueryResponse"."AssessmentId" = "Assessment"."id"
                ORDER BY "AssessmentQueryResponse"."CreatedAt" DESC
                LIMIT 1
            )`;

            const assessmentResponses = await AssessmentQueryResponse.findAll({
                include : [{
                    model    : Assessment,
                    as       : 'Assessment',
                    required : true,
                    where    : {
                        PatientUserId : sequelize.col('Assessment.PatientUserId')
                    },
                }],
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : AssessmentQueryResponse.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of assessmentResponses) {
                await UserEngagement.create({
                    PatientUserId   : c['Assessment'].PatientUserId,
                    Category        : UserEngagementCategories.Assessment,
                    RecordName      : 'Assessment',
                    AdditionalInfo  : c['Assessment'].Name,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Vitals = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_LabRecords = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Symptom = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Educational = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Chat = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Appointment = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Task = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Goal = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Newsfeed = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Profile = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Notice = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Form = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Survey = async () => {
        throw new Error("Method not implemented.");
    };

    // private recordUserEngagementsForDay_Overall = async () => {
    //     try {
    //     }
    //     catch (error) {
    //         Logger.instance().log(error.message);
    //     }
    // };

    //#endregion

}
