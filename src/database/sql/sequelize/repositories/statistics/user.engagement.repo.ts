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
import NoticeAction from "../../models/general/notice/notice.action.model";
import LabRecord from "../../models/clinical/lab.record/lab.record.model";
import HealthProfile from "../../models/users/patient/health.profile.model";
import PhysicalActivity from "../../models/wellness/exercise/physical.activity.model";
import Meditation from "../../models/wellness/exercise/meditation.model";
import UserLearning from "../../models/educational/learning/user.learning.model";
import ChatMessage from "../../models/community/chat/chat.message.model";
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
            await this.recordUserEngagementsForDay_Task();
            await this.recordUserEngagementsForDay_Profile();
            await this.recordUserEngagementsForDay_Notice();
            await this.recordUserEngagementsForDay_Exercise();

            // await this.recordUserEngagementsForDay_Form();
            // await this.recordUserEngagementsForDay_Survey();
            // await this.recordUserEngagementsForDay_Goal();
            // await this.recordUserEngagementsForDay_Newsfeed();
            // await this.recordUserEngagementsForDay_Appointment();
            //await this.recordUserEngagementsForDay_Overall();
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    //#endregion

    //#region Private methods

    private recordUserEngagementsForDay_Nutrition = async () => {
        try {
            const { fromUtc, toUtc } = this.getFromToRange();
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
            const { fromUtc, toUtc } = this.getFromToRange();
            const query = this.getSubquery("MedicationConsumption", "PatientUserId", "TakenAt");
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
            const { fromUtc, toUtc } = this.getFromToRange();
            const query = this.getSubquery("CareplanActivity", "PatientUserId", "CompletedAt");

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
            const { fromUtc, toUtc } = this.getFromToRange();

            const query = `(SELECT "AssessmentQueryResponse"."id"
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
        try {
            const todayStartUtc = TimeHelper.startOfTodayUtc();
            const fromUtc = TimeHelper.subtractDuration(todayStartUtc, 1, DurationType.Day);
            const toUtc = todayStartUtc;

            //Blood Cholesterol
            var sq = this.getSubquery("BloodCholesterol");
            const bloodCholesterols = await BloodCholesterol.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : BloodCholesterol.sequelize.literal(sq)
                    }
                }
            });
            await this.addVitalsEngagement(bloodCholesterols, 'BloodCholesterol');

            //Blood Glucose
            var sq = this.getSubquery("BloodGlucose");
            const bloodGlucoses = await BloodGlucose.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : BloodGlucose.sequelize.literal(sq)
                    }
                }
            });
            await this.addVitalsEngagement(bloodGlucoses, 'BloodGlucose');

            //Blood Pressure
            var sq = this.getSubquery("BloodPressure");
            const bloodPressures = await BloodPressure.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : BloodPressure.sequelize.literal(sq)
                    }
                }
            });
            await this.addVitalsEngagement(bloodPressures, 'BloodPressure');

            //Body Temperature
            var sq = this.getSubquery("BodyTemperature");
            const bodyTemperatures = await BodyTemperature.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : BodyTemperature.sequelize.literal(sq)
                    }
                }
            });
            await this.addVitalsEngagement(bodyTemperatures, 'BodyTemperature');

            //Body Weight
            var sq = this.getSubquery("BodyWeight");
            const bodyWeights = await BodyWeight.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : BodyWeight.sequelize.literal(sq)
                    }
                }
            });
            await this.addVitalsEngagement(bodyWeights, 'BodyWeight');

            //Pulse
            var sq = this.getSubquery("Pulse");
            const pulses = await Pulse.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : Pulse.sequelize.literal(sq)
                    }
                }
            });
            await this.addVitalsEngagement(pulses, 'Pulse');
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_LabRecords = async () => {
        try {
            const { fromUtc, toUtc } = this.getFromToRange();
            const query = this.getSubquery("LabRecord");
            const labRecords = await LabRecord.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : LabRecord.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of labRecords) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.LabRecords,
                    RecordName      : 'LabRecord',
                    AdditionalInfo  : c.TypeName,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Symptom = async () => {
        try {
            const { fromUtc, toUtc } = this.getFromToRange();
            var query = this.getSubquery("SymptomAssessment");

            const symptomAssessments = await SymptomAssessment.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : SymptomAssessment.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of symptomAssessments) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.Symptom,
                    RecordName      : 'SymptomAssessment',
                    AdditionalInfo  : c.Title,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }

            query = this.getSubquery("HowDoYouFeel", "PatientUserId", "RecordDate");

            const howDoYouFeels = await HowDoYouFeel.findAll({
                where : {
                    RecordDate : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : HowDoYouFeel.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of howDoYouFeels) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.Symptom,
                    RecordName      : 'HowDoYouFeel',
                    AdditionalInfo  : c.Feeling,
                    RecordTimestamp : c.RecordDate,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Educational = async () => {
        try {
            const { fromUtc, toUtc } = this.getFromToRange();
            const query = this.getSubquery("UserLearning", "UserId", "CreatedAt");

            const userLearnings = await UserLearning.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : UserLearning.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of userLearnings) {
                await UserEngagement.create({
                    PatientUserId   : c.UserId,
                    Category        : UserEngagementCategories.Educational,
                    RecordName      : 'UserLearning',
                    AdditionalInfo  : c.ContentId,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Chat = async () => {
        try {
            const { fromUtc, toUtc } = this.getFromToRange();
            const query = this.getSubquery("ChatMessage", "SenderId", "CreatedAt");

            const chats = await ChatMessage.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : ChatMessage.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of chats) {
                await UserEngagement.create({
                    PatientUserId   : c.SenderId,
                    Category        : UserEngagementCategories.Chat,
                    RecordName      : 'Chat',
                    AdditionalInfo  : c.Message,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Task = async () => {
        try {
            const { fromUtc, toUtc } = this.getFromToRange();
            const query = this.getSubquery("UserTask", "UserId", "StartedAt");

            const userTasks = await UserTask.findAll({
                where : {
                    StartedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : UserTask.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of userTasks) {
                await UserEngagement.create({
                    PatientUserId   : c.UserId,
                    Category        : UserEngagementCategories.Task,
                    RecordName      : 'UserTask',
                    AdditionalInfo  : c.Task,
                    RecordTimestamp : c.StartedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Profile = async () => {
        try {
            const { fromUtc, toUtc } = this.getFromToRange();
            const query = this.getSubquery("HealthProfile", "PatientUserId", "UpdatedAt");

            const healthProfiles = await HealthProfile.findAll({
                where : {
                    UpdatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : HealthProfile.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of healthProfiles) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.Profile,
                    RecordName      : 'HealthProfile',
                    AdditionalInfo  : '',
                    RecordTimestamp : c.UpdatedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private recordUserEngagementsForDay_Notice = async () => {
        try {
            const { fromUtc, toUtc } = this.getFromToRange();
            const query = this.getSubquery("Notice", "UserId", "CreatedAt");

            const notices = await NoticeAction.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : NoticeAction.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of notices) {
                await UserEngagement.create({
                    PatientUserId   : c.UserId,
                    Category        : UserEngagementCategories.Notice,
                    RecordName      : 'Notice',
                    AdditionalInfo  : c.NoticeId,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }

    };

    private recordUserEngagementsForDay_Exercise = async () => {
        try {
            const { fromUtc, toUtc } = this.getFromToRange();

            //Exercise
            var query = this.getSubquery("PhysicalActivity", "PatientUserId", "CreatedAt");
            var activities = await PhysicalActivity.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : PhysicalActivity.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of activities) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.Exercise,
                    RecordName      : 'PhysicalActivity',
                    AdditionalInfo  : c.Category,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }

            //Meditations
            query = this.getSubquery("Meditation", "PatientUserId", "CreatedAt");
            var meditations = await Meditation.findAll({
                where : {
                    CreatedAt : {
                        [Op.between] : [fromUtc, toUtc]
                    },
                    id : {
                        [Op.eq] : Meditation.sequelize.literal(query) // Use the subquery as a condition
                    }
                }
            });
            for await (const c of meditations) {
                await UserEngagement.create({
                    PatientUserId   : c.PatientUserId,
                    Category        : UserEngagementCategories.Exercise,
                    RecordName      : 'Meditation',
                    AdditionalInfo  : c.Category,
                    RecordTimestamp : c.CreatedAt,
                    RecordId        : c.id,
                });
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private getFromToRange() {
        const todayStartUtc = TimeHelper.startOfTodayUtc();
        const fromUtc = TimeHelper.subtractDuration(todayStartUtc, 1, DurationType.Day);
        const toUtc = todayStartUtc;
        return { fromUtc, toUtc };
    }

    private async addVitalsEngagement(vitals: any[], recordName: string) {
        for await (const c of vitals) {
            await UserEngagement.create({
                PatientUserId   : c.PatientUserId,
                Category        : UserEngagementCategories.Vitals,
                RecordName      : recordName,
                AdditionalInfo  : '',
                RecordTimestamp : c.CreatedAt,
                RecordId        : c.id,
            });
        }
    }

    private getSubquery = (model: string, userId = 'PatientUserId', orderBy = 'CreatedAt') => {
        var query = `(
            SELECT id
            FROM "{{MODEL}}" AS subquery
            WHERE "{{MODEL}}"."{{USER_ID}}" = subquery."{{USER_ID}}"
            ORDER BY "{{ORDER_BY}}" DESC
            LIMIT 1
          )`;
        query = query.replace("{{MODEL}}", model);
        query = query.replace("{{USER_ID}}", userId);
        query = query.replace("{{ORDER_BY}}", orderBy);
        return query;
    };

    // private recordUserEngagementsForDay_Overall = async () => {
    //     try {
    //     }
    //     catch (error) {
    //         Logger.instance().log(error.message);
    //     }
    // };

    // private recordUserEngagementsForDay_Goal = async () => {
    //     throw new Error("Method not implemented.");
    // };

    // private recordUserEngagementsForDay_Newsfeed = async () => {
    //     throw new Error("Method not implemented.");
    // };

    // private recordUserEngagementsForDay_Survey = async () => {
    //     throw new Error("Method not implemented.");
    // };

    // private recordUserEngagementsForDay_Form = async () => {
    //     throw new Error("Method not implemented.");
    // };

    //#endregion

}
